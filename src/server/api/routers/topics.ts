import { CreateTopicSchema } from "@/lib/schema/topics";
import { topics } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TopicsRouter = createTRPCRouter({
  getTopics: protectedProcedure.query(async ({ ctx }) => {
    const topics = await ctx.db.query.topics.findMany();
    return topics;
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
});

export default TopicsRouter;
