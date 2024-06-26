import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  integer,
  pgEnum,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `drktr_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("createdById", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt"),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

export const users = createTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  password: char("password", { length: 60 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const publishers = createTable("publisher", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  apiKey: varchar("api_key", { length: 256 }).notNull(),
  fbBusinessManagerId: text("fb_business_manager_id"),
  active: boolean("active")
    .$defaultFn(() => true)
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const publishersRelations = relations(publishers, ({ many }) => ({
  topics: many(publisherOnTopics),
  trafficRequests: many(trafficRequests),
}));

export const publisherOnTopics = pgTable("publisher_topics", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  publisherId: text("publisher_id")
    .notNull()
    .references(() => publishers.id),
  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id),
});

export const publisherOnTopicsRelations = relations(
  publisherOnTopics,
  ({ one }) => ({
    publisher: one(publishers, {
      fields: [publisherOnTopics.publisherId],
      references: [publishers.id],
    }),
    topic: one(topics, {
      fields: [publisherOnTopics.topicId],
      references: [topics.id],
    }),
  }),
);

export const topics = createTable("topic", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const topicsRelations = relations(topics, ({ many }) => ({
  landingPages: many(landingPages),
  publishers: many(publisherOnTopics),
  trafficRequests: many(trafficRequests),
}));

export const deviceEnum = pgEnum("device", ["desktop", "mobile", "any"]);
export const rulesetBehaviourEnum = pgEnum("ruleset_behaviour", [
  "taboola",
  "facebook",
  "default",
]);

export const trafficRulesets = createTable("traffic_rulesets", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  name: varchar("name", { length: 256 }).notNull(),
  referrer_url_min_length: integer("referrer_url_min_length").notNull(),
  device: deviceEnum("device").notNull(),

  no_referer_allowed: boolean("no_referer_allowed").default(false),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const trafficRulesetRelations = relations(
  trafficRulesets,
  ({ many }) => ({
    landingPages: many(pagesOnTrafficRulesets),
    rulesetAllowedDomains: many(rulesetAllowedDomains),
    rulesetRequiredParameters: many(rulesetRequiredParameters),
    trafficRequests: many(trafficRequests),
  }),
);

export const rulesetAllowedDomains = createTable("traffic_ruleset_domains", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  domain: text("domain").unique().notNull(),
  trafficRulesetId: text("traffic_ruleset")
    .notNull()
    .references(() => trafficRulesets.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const rulesetAllowedDomainsRelations = relations(
  rulesetAllowedDomains,
  ({ one }) => ({
    trafficRuleset: one(trafficRulesets, {
      fields: [rulesetAllowedDomains.trafficRulesetId],
      references: [trafficRulesets.id],
    }),
  }),
);

export const rulesetRequiredParameters = createTable(
  "traffic_ruleset_parameters",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    parameter: text("parameter").unique().notNull(),
    trafficRulesetId: text("traffic_ruleset")
      .notNull()
      .references(() => trafficRulesets.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export const rulesetRequiredParametersRelations = relations(
  rulesetRequiredParameters,
  ({ one }) => ({
    trafficRuleset: one(trafficRulesets, {
      fields: [rulesetRequiredParameters.trafficRulesetId],
      references: [trafficRulesets.id],
    }),
  }),
);

export const feedProviderEnum = pgEnum("feed_provider", [
  "SYSTEM1",
  "ADS.COM",
  "TONIC",
  "SEDO",
  "YOUVERSAL",
  "PERION",
  "ADMAKXX",
  "FIRST_OFFER",
  "ADVERTIV",
]);

export const landingPages = createTable("landing_pages", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  name: varchar("name", { length: 256 }).notNull(),
  url: text("url").notNull(),

  feedProvider: feedProviderEnum("feed_provider").notNull(),

  maxDailyHits: integer("max_daily_hits").notNull(),
  ipFreqCap: integer("ip_frequency_cap").notNull(),
  ipFreqCapHours: integer("ip_frequency_cap_hours").notNull(),
  geo: text("geo_country")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  device: deviceEnum("device").notNull(),

  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const landingPagesRelations = relations(
  landingPages,
  ({ one, many }) => ({
    topic: one(topics, {
      fields: [landingPages.topicId],
      references: [topics.id],
    }),
    trafficRulesets: many(pagesOnTrafficRulesets),
    trafficRequests: many(trafficRequests),
  }),
);

//To keep record of LANDING PAGES -> TRAFFIC RULESETS, many-to-many
export const pagesOnTrafficRulesets = pgTable("pages_traffic_rulesets", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  landingPageId: text("landing_page_id")
    .notNull()
    .references(() => landingPages.id),
  trafficRulesetId: text("traffic_ruleset_id")
    .notNull()
    .references(() => trafficRulesets.id),
});

export const pagesOnTrafficRulesetsRelations = relations(
  pagesOnTrafficRulesets,
  ({ one }) => ({
    landingPage: one(landingPages, {
      fields: [pagesOnTrafficRulesets.landingPageId],
      references: [landingPages.id],
    }),
    trafficRuleset: one(trafficRulesets, {
      fields: [pagesOnTrafficRulesets.trafficRulesetId],
      references: [trafficRulesets.id],
    }),
  }),
);

export const backupLandingPages = createTable("backup_landing_page", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  name: varchar("name", { length: 256 }).notNull(),
  url: text("url").notNull(),
  maxDailyHits: integer("max_daily_hits").notNull(),
  device: deviceEnum("device").notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const backupLandingPagesRelations = relations(
  backupLandingPages,
  ({ many }) => ({
    trafficRequests: many(trafficRequests),
  }),
);

export const globalTrafficRules = createTable("global_traffic_rules", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  block_http_traffic: boolean("block_http_traffic").default(false).notNull(),
  block_alternative_browsers: boolean("block_alternative_browsers")
    .default(false)
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const adIds = createTable("ad_ids", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  adIdValue: text("ad_id_value").notNull(),
  publisherId: text("publisher_id").notNull(),
  topicId: text("topic_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const adIdsRelations = relations(adIds, ({ one }) => ({
  publisher: one(publishers, {
    fields: [adIds.publisherId],
    references: [publishers.id],
  }),
  topic: one(topics, {
    fields: [adIds.topicId],
    references: [topics.id],
  }),
}));

export const trafficRequests = createTable("traffic_requests", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  referrerUrl: text("referrer_url"),
  ip: text("ip").notNull(),
  deviceType: deviceEnum("device_type").notNull(),
  deviceOs: text("device_os").notNull(),
  browser: text("browser").notNull(),
  geo: text("geo").notNull(),
  accepted: boolean("accepted").notNull().default(true),
  declineReason: text("decline_reason"),
  monetized: boolean("monetized").default(false),
  adidId: text("ad_id_id"),
  trafficRulesetId: text("traffic_ruleset_id").notNull(),
  landingPageId: text("landing_page_id"),
  backupLandingPageId: text("backup_landing_page_id"),
  topicId: text("topic_id").notNull(),
  publisherId: text("publisher_id").notNull(),
  monetizedAt: timestamp("monetized_at"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const trafficRequestsRelations = relations(
  trafficRequests,
  ({ one }) => ({
    adId: one(adIds, {
      fields: [trafficRequests.adidId],
      references: [adIds.id],
    }),
    landingPage: one(landingPages, {
      fields: [trafficRequests.landingPageId],
      references: [landingPages.id],
    }),
    backupLandingPage: one(backupLandingPages, {
      fields: [trafficRequests.backupLandingPageId],
      references: [backupLandingPages.id],
    }),
    trafficRuleset: one(trafficRulesets, {
      fields: [trafficRequests.trafficRulesetId],
      references: [trafficRulesets.id],
    }),
    topic: one(topics, {
      fields: [trafficRequests.topicId],
      references: [topics.id],
    }),
    publisher: one(publishers, {
      fields: [trafficRequests.publisherId],
      references: [publishers.id],
    }),
  }),
);
