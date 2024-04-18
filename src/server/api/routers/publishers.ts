import {
  AssignPublisherTopicSchema,
  CreatePublisherSchema,
  EditPublisherSchema,
  GetPublishersSchema,
  RemovePublisherTopicSchema,
} from "@/lib/schema/publishers";
import { IPublisher } from "@/lib/types/generic";
import {
  publishers,
  publsiherOnTopics,
  topics,
  users,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const PublishersRouter = createTRPCRouter({
  getPublishers: protectedProcedure
    .input(GetPublishersSchema)
    .query(async ({ ctx, input }) => {
      if (input.topic_id_filter) {
        const publisherOnTopic = await ctx.db.query.publsiherOnTopics.findMany({
          where: eq(publsiherOnTopics.topicId, input.topic_id_filter),
        });
        const publisherIds = publisherOnTopic.map((p) => p.publisherId);
        if (!(publisherIds.length > 0)) return [] as IPublisher[];

        const filteredPublishers = await ctx.db.query.publishers.findMany({
          where: inArray(publishers.id, publisherIds),
          with: { topics: { with: { topic: true } } },
          orderBy: [desc(publishers.createdAt)],
        });
        return filteredPublishers as IPublisher[];
      } else {
        const filteredPublishers = await ctx.db.query.publishers.findMany({
          with: { topics: { with: { topic: true } } },
          orderBy: [desc(publishers.createdAt)],
        });
        return filteredPublishers as IPublisher[];
      }
    }),
  createPublisher: protectedProcedure
    .input(CreatePublisherSchema)
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db
        .insert(publishers)
        .values({
          name: input.name,
          apiKey: crypto.randomUUID(),
        })
        .returning();
      return publisher[0];
    }),
  editPublisher: protectedProcedure
    .input(EditPublisherSchema)
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(publishers.id, input.publisher_id),
      });
      if (!publisher)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This publisher doesn't exist!",
        });

      await ctx.db
        .update(publishers)
        .set({
          active: input.active,
        })
        .where(eq(publishers.id, publisher.id));

      return true;
    }),
  deletePublisher: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(users.id, input),
      });
      return publisher;
    }),
  assignTopic: protectedProcedure
    .input(AssignPublisherTopicSchema)
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(publishers.id, input.publisher_id),
      });
      if (!publisher)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Publisher doesn't exist!",
        });

      const topic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.topic_id),
      });
      if (!topic)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic doesn't exist!",
        });

      await ctx.db.insert(publsiherOnTopics).values({
        publisherId: input.publisher_id,
        topicId: input.topic_id,
      });

      return true;
    }),
  removeTopic: protectedProcedure
    .input(RemovePublisherTopicSchema)
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publsiherOnTopics.findFirst({
        where: eq(publsiherOnTopics.id, input.publisher_topic_relation_id),
      });
      if (!publisher)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Publisher topic relation doesn't exist!",
        });

      await ctx.db
        .delete(publsiherOnTopics)
        .where(eq(publsiherOnTopics.id, input.publisher_topic_relation_id));

      return true;
    }),
});

export default PublishersRouter;
