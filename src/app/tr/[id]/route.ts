import { env } from "@/env";
import { db } from "@/server/db";
import {
  adIds,
  deviceEnum,
  landingPages,
  publisherOnTopics,
  publishers,
  rulesetAllowedDomains,
  topics,
  trafficRequests,
  trafficRulesets,
} from "@/server/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { and, count, eq, gte } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const requestParams = new URL(req.url).searchParams;

  const publisherOnTopic = await db.query.publisherOnTopics.findFirst({
    where: eq(publisherOnTopics.id, params.id),
    with: { publisher: true, topic: true },
  });
  if (!publisherOnTopic)
    return Response.json({ success: false, error: "PublisherTopic not found" });

  const userAgent = req.headers.get("user-agent");
  if (!userAgent)
    return Response.json(
      { success: false, error: "Invalid Request" },
      { status: 400 },
    );

  const requestIp = req.headers.get("x-forwarded-for") ?? "1.1.1.1";

  const referer = req.headers.get("referer");
  const requestHostname = referer ? new URL(referer).hostname : null;

  const parseUa = new UAParser(userAgent);
  const parsedUa = parseUa.getResult();
  const deviceType = (
    parsedUa.device.type === "mobile"
      ? deviceEnum.enumValues[1]
      : deviceEnum.enumValues[0]
  ) as (typeof deviceEnum.enumValues)[number];
  const deviceOs = `${parsedUa.os.name} ${parsedUa.os.version}`;
  const browser = `${parsedUa.browser.name} ${parsedUa.browser.version}`;

  let elegibleLandingPages = [];
  let elegibleTrafficRuleset;

  //Find the landing pages that matches the referer and deviceType
  if (requestHostname === null) {
    //If there is no referer
    const trafficRuleset = await db.query.trafficRulesets.findFirst({
      where: eq(trafficRulesets.no_referer_allowed, true),
      with: { landingPages: { with: { landingPage: true } } },
    });
    if (!trafficRuleset)
      return Response.json(
        { success: false, error: "No ruleset allows no referer" },
        { status: 400 },
      );

    elegibleTrafficRuleset = trafficRuleset;

    elegibleLandingPages = trafficRuleset.landingPages
      .filter(
        (f) =>
          ["any", deviceType].includes(f.landingPage.device) &&
          f.landingPage.topicId === publisherOnTopic.topicId,
      )
      .map((lp) => lp.landingPage);
  } else {
    const rulesetAllowedDomain = await db.query.rulesetAllowedDomains.findFirst(
      {
        where: eq(rulesetAllowedDomains.domain, requestHostname),
        with: {
          trafficRuleset: {
            with: { landingPages: { with: { landingPage: true } } },
          },
        },
      },
    );
    if (!rulesetAllowedDomain)
      return Response.json(
        { success: false, error: "No ruleset matches this referer" },
        { status: 400 },
      );

    elegibleTrafficRuleset = rulesetAllowedDomain.trafficRuleset;

    elegibleLandingPages = rulesetAllowedDomain.trafficRuleset.landingPages
      .filter(
        (f) =>
          ["any", deviceType].includes(f.landingPage.device) &&
          f.landingPage.topicId === publisherOnTopic.topicId,
      )
      .map((lp) => lp.landingPage);
  }

  //Filter the elegibleLandingPages by maxDailyHits, and by max in X IP hits
  elegibleLandingPages = await Promise.all(
    elegibleLandingPages.filter(async (landingPage) => {
      const totalDailyHitsResult = await db
        .select({ count: count() })
        .from(trafficRequests)
        .where(
          and(
            eq(trafficRequests.landingPageId, landingPage.id),
            gte(
              trafficRequests.createdAt,
              new Date(new Date().getTime() - 8.64e7),
            ),
          ),
        );
      const totalDailyHits = totalDailyHitsResult.at(0)?.count;
      if (
        totalDailyHits === undefined ||
        totalDailyHits > landingPage.maxDailyHits
      )
        return false;

      const totalIpHitsResult = await db
        .select({ count: count() })
        .from(trafficRequests)
        .where(
          and(
            eq(trafficRequests.landingPageId, landingPage.id),
            eq(trafficRequests.ip, requestIp),
            gte(
              trafficRequests.createdAt,
              new Date(
                new Date().getTime() - 3.6e6 * landingPage.ipFreqCapHours,
              ),
            ),
          ),
        );
      const totalIpHits = totalIpHitsResult.at(0)?.count;
      if (totalIpHits === undefined || totalIpHits > landingPage.ipFreqCap)
        return false;

      return true;
    }),
  );

  const landingPage = elegibleLandingPages.at(0)!;

  const requestId = createId();
  const redirectUrl = getRedirectUrl(
    requestId,
    publisherOnTopic.publisher,
    landingPage,
    publisherOnTopic.topic,
  );

  let adidDrktrId = null;
  const adidParam = requestParams.get("adid");
  if (adidParam) {
    const existingAdId = await db.query.adIds.findFirst({
      where: and(
        eq(adIds.adIdValue, adidParam),
        eq(adIds.publisherId, publisherOnTopic.publisherId),
        eq(adIds.topicId, publisherOnTopic.topicId),
      ),
    });
    if (existingAdId) {
      adidDrktrId = existingAdId.id;
    } else {
      const createdAdIds = await db
        .insert(adIds)
        .values({
          adIdValue: adidParam,
          publisherId: publisherOnTopic.publisherId,
          topicId: publisherOnTopic.topicId,
        })
        .returning();
      const createdAdId = createdAdIds.at(0)!;
      adidDrktrId = createdAdId.id;
    }
  }

  const trafficRequest = await db.insert(trafficRequests).values({
    id: requestId,
    referrerUrl: referer,
    ip: requestIp,
    deviceType,
    deviceOs,
    browser,
    geo: "US",
    trafficRulesetId: elegibleTrafficRuleset.id,
    landingPageId: landingPage.id,
    topicId: publisherOnTopic.topicId,
    publisherId: publisherOnTopic.publisherId,
  });

  return Response.json(
    {
      redirect_url: redirectUrl,
      request_id: requestId,
      ad_id_drktr_id: adidDrktrId,
      publisherOnTopic: params.id,
      ua: {
        device: {
          type: deviceType,
          os: deviceOs,
        },
        browser,
      },
      ref: {
        hostname: requestHostname,
        raw: referer,
      },
      landing_page: landingPage,
    },
    { status: 200 },
  );
};

const getRedirectUrl = (
  request_id: string,
  publisher: typeof publishers.$inferSelect,
  landingPage: typeof landingPages.$inferSelect,
  topic: typeof topics.$inferSelect,
) => {
  const redirectUrl = new URL(landingPage.url);
  const clickTrackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/clicktrack/${request_id}`;

  if (landingPage.feedProvider === "SYSTEM1") {
    redirectUrl.searchParams.append("rskey", topic.name);
    redirectUrl.searchParams.append("headline", topic.name);
    redirectUrl.searchParams.append("click_track_url", clickTrackUrl);
  } else if (landingPage.feedProvider === "PERION") {
    redirectUrl.searchParams.append("gd", "1234");
    redirectUrl.searchParams.append("q", topic.name);
    redirectUrl.searchParams.append("pb", clickTrackUrl);
    redirectUrl.searchParams.append("stid", "1234");
  }

  return redirectUrl;
};
