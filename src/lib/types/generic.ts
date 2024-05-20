import {
  feedProviderEnum,
  landingPages,
  pagesOnTrafficRulesets,
  publisherOnTopics,
  publishers,
  rulesetAllowedDomains,
  rulesetRequiredParameters,
  topics,
  trafficRequests,
  trafficRulesets,
} from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type FeedProvider = (typeof feedProviderEnum.enumValues)[number];

export type IPublisherTopic = InferSelectModel<typeof publisherOnTopics> & {
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

export type ILandingPageRuleset = InferSelectModel<
  typeof pagesOnTrafficRulesets
> & {
  trafficRuleset: InferSelectModel<typeof trafficRulesets>;
};

export type ILandingPage = InferSelectModel<typeof landingPages> & {
  topic: InferSelectModel<typeof topics>;
  trafficRulesets: ILandingPageRuleset[];
};

export type ITrafficRequest = InferSelectModel<typeof trafficRequests>;
