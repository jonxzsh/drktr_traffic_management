import { CreateTopicSchema } from "@/lib/schema/topics";
import { topics } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TopicsRouter = createTRPCRouter({
  getTopics: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.topics.findMany({
      orderBy: [desc(topics.createdAt)],
    });
    return results;
  }),
  createTopic: protectedProcedure
    .input(CreateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      const topic = await ctx.db
        .insert(topics)
        .values({
          name: input.name,
        })
        .returning();

      return topic[0];
    }),
  deleteTopic: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const topic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input),
      });
      if (!topic)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This topic doesn't exist!",
        });

      await ctx.db.delete(topics).where(eq(topics.id, topic.id));

      return true;
    }),
});

export default TopicsRouter;
