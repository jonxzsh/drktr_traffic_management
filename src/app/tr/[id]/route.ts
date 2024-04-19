import { db } from "@/server/db";
import { publisherOnTopics } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const publisherOnTopic = await db.query.publisherOnTopics.findFirst({
    where: eq(publisherOnTopics.id, params.id),
  });
  if (!publisherOnTopic)
    return Response.json({ success: false, error: "PublisherTopic not found" });

  const userAgent = req.headers.get("user-agent");
  if (!userAgent)
    return Response.json(
      { success: false, error: "Invalid Request" },
      { status: 400 },
    );
  const referer = req.headers.get("referer");
  if (!referer)
    return Response.json(
      { success: false, error: "Invalid Request" },
      { status: 400 },
    );

  const parseUa = new UAParser(userAgent);
  const parsedUa = parseUa.getResult();

  const requestHostname = new URL(referer).hostname;

  return Response.json(
    {
      publisherOnTopic: params.id,
      ua: { raw: userAgent, parsed: parsedUa },
      ref: {
        hostname: requestHostname,
        raw: referer,
      },
    },
    { status: 200 },
  );
};
