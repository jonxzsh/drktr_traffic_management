import { CreateTrafficRulesetSchema } from "@/lib/schema/traffic-rulesets";
import { landingPages, trafficRulesets } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TrafficRulesetsRouter = createTRPCRouter({
  getTrafficRulesets: protectedProcedure.query(async ({ ctx }) => {
    const trafficRulesets = await ctx.db.query.trafficRulesets.findMany();
    return trafficRulesets;
  }),
  createTrafficRuleset: protectedProcedure
    .input(CreateTrafficRulesetSchema)
    .mutation(async ({ ctx, input }) => {
      const trafficRuleset = await ctx.db
        .insert(trafficRulesets)
        .values({
          name: input.name,
          referrer_domains_allowed: input.referrer_domains_allowed,
          referrer_required_parameters: input.referrer_required_parameters,
          device: input.device,
        })
        .returning();
      return trafficRuleset[0];
    }),
  deleteTrafficRuleset: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const trafficRuleset = await ctx.db.query.trafficRulesets.findFirst({
        where: eq(trafficRulesets.id, input),
      });
      if (!trafficRuleset)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This traffic ruleset doesn't exist!",
        });

      const landingPagesUsingRuleset =
        await ctx.db.query.landingPages.findFirst({
          where: eq(landingPages.trafficRulesetId, trafficRuleset.id),
        });

      if (landingPagesUsingRuleset)
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Atleast one landing page is still using this traffic ruleset, you can't delete traffic rulesets with active landing pages",
        });

      return true;
    }),
});

export default TrafficRulesetsRouter;
