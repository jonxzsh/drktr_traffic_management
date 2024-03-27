import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import BackupLandingPagesRouter from "./routers/backup-landing-pages";
import LandingPagesRouter from "./routers/landing-pages";
import PublishersRouter from "./routers/publishers";
import TopicsRouter from "./routers/topics";
import TrafficRulesetsRouter from "./routers/traffic-rulesets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  publishers: PublishersRouter,
  landingPages: LandingPagesRouter,
  backupLandingPages: BackupLandingPagesRouter,
  topics: TopicsRouter,
  trafficRulesets: TrafficRulesetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
