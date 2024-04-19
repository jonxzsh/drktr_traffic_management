import {
  CreateLandingPageSchema,
  EditLandingPageSchema,
  GetLandingPagesSchema,
} from "@/lib/schema/landing-pages";
import { ILandingPage } from "@/lib/types/generic";
import {
  landingPages,
  pagesOnTrafficRulesets,
  topics,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const LandingPagesRouter = createTRPCRouter({
  getLandingPages: protectedProcedure
    .input(GetLandingPagesSchema)
    .query(async ({ ctx, input }) => {
      const pages = await ctx.db.query.landingPages.findMany({
        where: and(
          input.topic_id_filter
            ? eq(landingPages.topicId, input.topic_id_filter)
            : undefined,
          input.feed_provider_filter
            ? eq(landingPages.feedProvider, input.feed_provider_filter)
            : undefined,
        ),
        orderBy: [desc(landingPages.createdAt)],
        with: {
          topic: true,
          trafficRulesets: { with: { trafficRuleset: true } },
        },
      });
      return pages as ILandingPage[];
    }),
  createLandingPage: protectedProcedure
    .input(CreateLandingPageSchema)
    .mutation(async ({ ctx, input }) => {
      const topicExists = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.topic_id),
      });
      if (!topicExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This topic doesn't exist!",
        });

      const landingPage = await ctx.db
        .insert(landingPages)
        .values({
          name: input.name,
          url: input.url,

          feedProvider: input.feed_provider,
          maxDailyHits: input.max_daily_hits,
          ipFreqCap: input.ip_frequency_cap.requests,
          ipFreqCapHours: input.ip_frequency_cap.hours,
          geo: input.geo,
          device: input.device,
          referrerRequired: input.referrer_required,

          topicId: input.topic_id,
        })
        .returning();

      const createdLandingPage = landingPage[0];
      if (!createdLandingPage)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create landing page!",
        });

      if (input.traffic_ruleset_ids && input.traffic_ruleset_ids.length > 0) {
        input.traffic_ruleset_ids.forEach(async (ruleset) => {
          await ctx.db.insert(pagesOnTrafficRulesets).values({
            landingPageId: createdLandingPage.id,
            trafficRulesetId: ruleset,
          });
        });
      }

      return createdLandingPage;
    }),
  editLandingPage: protectedProcedure
    .input(EditLandingPageSchema)
    .mutation(async ({ ctx, input }) => {
      const landingPage = await ctx.db.query.landingPages.findFirst({
        where: eq(landingPages.id, input.landing_page_id),
      });
      if (!landingPage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This landing page doesn't exist!",
        });

      await ctx.db
        .delete(pagesOnTrafficRulesets)
        .where(eq(pagesOnTrafficRulesets.landingPageId, landingPage.id));

      if (input.traffic_ruleset_ids && input.traffic_ruleset_ids.length > 0) {
        input.traffic_ruleset_ids.forEach(async (ruleset) => {
          await ctx.db.insert(pagesOnTrafficRulesets).values({
            landingPageId: landingPage.id,
            trafficRulesetId: ruleset,
          });
        });
      }

      await ctx.db
        .update(landingPages)
        .set({
          name: input.name,
          url: input.url,

          feedProvider: input.feed_provider,
          maxDailyHits: input.max_daily_hits,
          ipFreqCap: input.ip_frequency_cap.requests,
          ipFreqCapHours: input.ip_frequency_cap.hours,
          geo: input.geo,
          device: input.device,
          referrerRequired: input.referrer_required,

          topicId: input.topic_id,
        })
        .where(eq(landingPages.id, landingPage.id));

      return true;
    }),
  deleteLandingPage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.db.query.landingPages.findFirst({
        where: eq(landingPages.id, input),
      });
      if (!page)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This landing page doesn't exist!",
        });

      const landingPageTopic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, page.topicId),
        with: { landingPages: true },
      });
      if (
        landingPageTopic &&
        landingPageTopic.id &&
        !(landingPageTopic.landingPages.length > 0)
      ) {
        //The Topic has no more landing pages so we can delete it
        await ctx.db.delete(topics).where(eq(topics.id, landingPageTopic.id));
      }
      await ctx.db.delete(landingPages).where(eq(landingPages.id, page.id));

      return true;
    }),
});

export default LandingPagesRouter;
