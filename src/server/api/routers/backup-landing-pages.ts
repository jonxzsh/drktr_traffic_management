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
