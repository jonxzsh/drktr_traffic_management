import { trafficRequests } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TrafficRequestsRouter = createTRPCRouter({
  getTrafficRequests: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.trafficRequests.findMany({
      orderBy: desc(trafficRequests.createdAt),
    });
  }),
});

export default TrafficRequestsRouter;
