import {
  CreateTrafficRulesetSchema,
  EditTrafficRulesetSchema,
} from "@/lib/schema/traffic-rulesets";
import { ITrafficRuleset } from "@/lib/types/generic";
import {
  landingPages,
  rulesetAllowedDomains,
  rulesetRequiredParameters,
  trafficRulesets,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TrafficRulesetsRouter = createTRPCRouter({
  getTrafficRulesets: protectedProcedure.query(async ({ ctx }) => {
    const rulesets = (await ctx.db.query.trafficRulesets.findMany({
      with: {
        rulesetAllowedDomains: true,
        rulesetRequiredParameters: true,
      },
      orderBy: [desc(trafficRulesets.createdAt)],
    })) as ITrafficRuleset[];
    return rulesets;
  }),
  createTrafficRuleset: protectedProcedure
    .input(CreateTrafficRulesetSchema)
    .mutation(async ({ ctx, input }) => {
      const trafficRuleset = await ctx.db
        .insert(trafficRulesets)
        .values({
          name: input.name,
          referrer_url_min_length: input.referrer_url_min_length,
          device: input.device,
        })
        .returning();

      const newRuleset = trafficRuleset[0];
      if (!newRuleset)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create traffic ruleset!",
        });

      input.referrer_domains_allowed.forEach(async (domain) => {
        await ctx.db.insert(rulesetAllowedDomains).values({
          domain: domain.value,
          trafficRulesetId: newRuleset.id,
        });
      });

      input.referrer_required_parameters.forEach(async (parameter) => {
        await ctx.db.insert(rulesetRequiredParameters).values({
          parameter: parameter.value,
          trafficRulesetId: newRuleset.id,
        });
      });

      return newRuleset;
    }),
  editTrafficRuleset: protectedProcedure
    .input(EditTrafficRulesetSchema)
    .mutation(async ({ ctx, input }) => {
      const trafficRuleset = await ctx.db.query.trafficRulesets.findFirst({
        where: eq(trafficRulesets.id, input.ruleset_id),
      });
      if (!trafficRuleset)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This traffic ruleset doesn't exist!",
        });

      const updatedRulesets = await ctx.db
        .update(trafficRulesets)
        .set({
          name: input.name,
          device: input.device,
          referrer_url_min_length: input.referrer_url_min_length,
        })
        .where(eq(trafficRulesets.id, trafficRuleset.id))
        .returning();

      await ctx.db
        .delete(rulesetAllowedDomains)
        .where(eq(rulesetAllowedDomains.trafficRulesetId, trafficRuleset.id));

      input.referrer_domains_allowed.forEach(async (domain) => {
        await ctx.db.insert(rulesetAllowedDomains).values({
          domain: domain.value,
          trafficRulesetId: trafficRuleset.id,
        });
      });

      await ctx.db
        .delete(rulesetRequiredParameters)
        .where(
          eq(rulesetRequiredParameters.trafficRulesetId, trafficRuleset.id),
        );

      input.referrer_required_parameters.forEach(async (parameter) => {
        await ctx.db.insert(rulesetRequiredParameters).values({
          parameter: parameter.value,
          trafficRulesetId: trafficRuleset.id,
        });
      });

      return true;
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
