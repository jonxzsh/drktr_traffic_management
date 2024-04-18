import {
  feedProviderEnum,
  publishers,
  publsiherOnTopics,
  rulesetAllowedDomains,
  rulesetRequiredParameters,
  topics,
  trafficRulesets,
} from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type FeedProvider = (typeof feedProviderEnum.enumValues)[number];

export type IPublisherTopic = InferSelectModel<typeof publsiherOnTopics> & {
  topic: InferSelectModel<typeof topics>;
};

export type IPublisher = InferSelectModel<typeof publishers> & {
  topics: IPublisherTopic[];
};

export type ITrafficRuleset = InferSelectModel<typeof trafficRulesets> & {
  rulesetAllowedDomains: InferSelectModel<typeof rulesetAllowedDomains>[];
  rulesetRequiredParameters: InferSelectModel<
    typeof rulesetRequiredParameters
  >[];
};
