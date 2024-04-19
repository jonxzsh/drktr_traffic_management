import { CreateTopicSchema } from "@/lib/schema/topics";
import { publisherOnTopics, publishers, topics } from "@/server/db/schema";
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
  assignAllPublishers: protectedProcedure
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

      const activePublishers = await ctx.db.query.publishers.findMany({
        where: eq(publishers.active, true),
      });
      if (!(activePublishers.length > 0))
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "There are no active publishers!",
        });

      activePublishers.forEach(async (publisher) => {
        await ctx.db.insert(publisherOnTopics).values({
          publisherId: publisher.id,
          topicId: topic.id,
        });
      });

      return true;
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

      const assignedPublishers = await ctx.db.query.publisherOnTopics.findFirst(
        {
          where: eq(publisherOnTopics.topicId, topic.id),
        },
      );
      if (assignedPublishers)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Atleast one publisher is still assigned this topic!",
        });

      await ctx.db.delete(topics).where(eq(topics.id, topic.id));

      return true;
    }),
});

export default TopicsRouter;
