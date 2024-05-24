import { trafficRequests } from "@/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TrafficRequestsRouter = createTRPCRouter({
  getTrafficStats: protectedProcedure.query(async ({ ctx }) => {
    const totalRequests = await ctx.db
      .select({ count: count() })
      .from(trafficRequests);
    const totalRequestsCount = totalRequests.at(0)?.count;
    const monetziedRequests = await ctx.db
      .select({ count: count() })
      .from(trafficRequests)
      .where(eq(trafficRequests.monetized, true));
    const monetizedRequestsCount = monetziedRequests.at(0)?.count;
    return { totalRequestsCount, monetizedRequestsCount };
  }),
  getTrafficRequests: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.trafficRequests.findMany({
      orderBy: desc(trafficRequests.createdAt),
    });
  }),
});

export default TrafficRequestsRouter;
