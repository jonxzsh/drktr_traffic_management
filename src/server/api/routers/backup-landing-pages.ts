import {
  CreateBackupLandingPageSchema,
  EditBackupLandingPageSchema,
} from "@/lib/schema/backup-landing-pages";
import { backupLandingPages } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const BackupLandingPagesRouter = createTRPCRouter({
  getBackupLandingPages: protectedProcedure.query(async ({ ctx }) => {
    const backupPages = await ctx.db.query.backupLandingPages.findMany();
    return backupPages;
  }),
  createBackupLandingPage: protectedProcedure
    .input(CreateBackupLandingPageSchema)
    .mutation(async ({ ctx, input }) => {
      const backupLandingPage = await ctx.db
        .insert(backupLandingPages)
        .values({
          name: input.name,
          url: input.url,
          device: input.device,
          maxDailyHits: input.max_daily_hits,
        })
        .returning();

      return backupLandingPage[0];
    }),
  editBackupLandingPage: protectedProcedure
    .input(EditBackupLandingPageSchema)
    .mutation(async ({ ctx, input }) => {
      const backupLandingPage = await ctx.db.query.backupLandingPages.findFirst(
        {
          where: eq(backupLandingPages.id, input.landing_page_id),
        },
      );
      if (!backupLandingPage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This backup landing page doesn't exist!",
        });

      await ctx.db
        .update(backupLandingPages)
        .set({
          name: input.name,
          url: input.url,
          maxDailyHits: input.max_daily_hits,
          device: input.device,
        })
        .where(eq(backupLandingPages.id, backupLandingPage.id))
        .returning();

      return true;
    }),
  deleteBackupLandingPage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const backupPage = await ctx.db.query.backupLandingPages.findFirst({
        where: eq(backupLandingPages.id, input),
        orderBy: [desc(backupLandingPages.createdAt)],
      });
      if (!backupPage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This backup landing page doesn't exist!",
        });

      await ctx.db
        .delete(backupLandingPages)
        .where(eq(backupLandingPages.id, backupPage.id));

      return true;
    }),
});

export default BackupLandingPagesRouter;
