import { SetGlobalTrafficRulesSchema } from "@/lib/schema/global-traffic-rules";
import { globalTrafficRules } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const GlobalTrafficRulesRouter = createTRPCRouter({
  getRules: protectedProcedure.query(async ({ ctx }) => {
    const globalRules = await ctx.db.query.globalTrafficRules.findFirst();
    return globalRules;
  }),
  setRules: protectedProcedure
    .input(SetGlobalTrafficRulesSchema)
    .mutation(async ({ ctx, input }) => {
      const existingRules = await ctx.db.query.globalTrafficRules.findFirst();
      if (existingRules) {
        await ctx.db
          .update(globalTrafficRules)
          .set({
            block_http_traffic: input.block_http_traffic,
            block_alternative_browsers: input.block_alternative_browsers,
          })
          .where(eq(globalTrafficRules.id, existingRules.id));
      } else {
        await ctx.db.insert(globalTrafficRules).values({
          block_http_traffic: input.block_http_traffic,
          block_alternative_browsers: input.block_alternative_browsers,
        });
      }

      return true;
    }),
});

export default GlobalTrafficRulesRouter;
