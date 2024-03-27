import { CreateLandingPageSchema } from "@/lib/schema/landing-pages";
import { landingPages, topics } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const LandingPagesRouter = createTRPCRouter({
  getLandingPages: protectedProcedure.query(async ({ ctx }) => {
    const pages = await ctx.db.query.landingPages.findMany();
    return pages;
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

          maxDailyHits: input.max_daily_hits,
          ipFreqCap: input.ip_frequency_cap.requests,
          ipFreqCapHours: input.ip_frequency_cap.hours,
          geo: input.geo,
          device: input.device,
          referrerRequired: input.referrer_required,

          topicId: input.topic_id,
          trafficRulesetId: input.traffic_ruleset_id,
        })
        .returning();

      return landingPage[0];
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
