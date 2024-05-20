import { db } from "@/server/db";
import { trafficRequests } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (
  req: Request,
  { params }: { params: { requestId: string } },
) => {
  const trafficRequest = await db.query.trafficRequests.findFirst({
    where: eq(trafficRequests.id, params.requestId),
  });
  if (!trafficRequest)
    return Response.json(
      { success: false, error: "This traffic request doesn't exist!" },
      { status: 404 },
    );

  await db
    .update(trafficRequests)
    .set({
      monetized: true,
      monetizedAt: new Date(),
    })
    .where(eq(trafficRequests.id, trafficRequest.id));

  return Response.json({ success: true }, { status: 200 });
};
