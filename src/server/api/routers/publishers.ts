import { CreatePublisherSchema } from "@/lib/schema/publishers";
import { publishers, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const PublishersRouter = createTRPCRouter({
  getPublishers: protectedProcedure.query(async ({ ctx }) => {
    const publishers = await ctx.db.query.publishers.findMany();
    return publishers;
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
  deletePublisher: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(users.id, input),
      });
      return publisher;
    }),
});

export default PublishersRouter;
