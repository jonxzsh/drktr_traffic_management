import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  integer,
  pgEnum,
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
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const deviceEnum = pgEnum("device", ["desktop", "mobile", "any"]);

export const trafficRulesets = createTable("traffic_rulesets", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  name: varchar("name", { length: 256 }).notNull(),

  referrer_domains_allowed: text("referrer_domains_allowed").array(),
  referrer_required_parameters: text("referrer_required_parameters").array(),
  device: deviceEnum("device").notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const trafficRulesetRelations = relations(
  trafficRulesets,
  ({ many }) => ({
    landingPages: many(landingPages),
  }),
);

export const topics = createTable("topic", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const topicsRelations = relations(topics, ({ many }) => ({
  landingPages: many(landingPages),
}));

export const landingPages = createTable("landing_page", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  name: varchar("name", { length: 256 }).notNull(),
  url: text("url").notNull(),

  maxDailyHits: integer("max_daily_hits").notNull(),
  ipFreqCap: integer("ip_frequency_cap").notNull(),
  ipFreqCapHours: integer("ip_frequency_cap_hours").notNull(),
  geo: text("geo_country"),
  device: deviceEnum("device").notNull(),
  referrerRequired: boolean("referrer_required").notNull(),

  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id),

  trafficRulesetId: text("traffic_ruleset")
    .notNull()
    .references(() => trafficRulesets.id),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  topic: one(topics, {
    fields: [landingPages.topicId],
    references: [topics.id],
  }),
  trafficRuleset: one(trafficRulesets, {
    fields: [landingPages.trafficRulesetId],
    references: [trafficRulesets.id],
  }),
}));

export const backupLandingPages = createTable("backup_landing_page", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),

  url: text("url").notNull(),
  maxDailyHits: integer("max_daily_hits").notNull(),
  device: deviceEnum("device").notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const globalTrafficRules = createTable("global_traffic_rules", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  block_http_traffic: boolean("block_http_traffic").default(false).notNull(),
  block_alternative_browsers: boolean("block_alternative_browsers")
    .default(false)
    .notNull(),
  device: deviceEnum("device"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
