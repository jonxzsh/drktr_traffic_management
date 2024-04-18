import { deviceEnum, feedProviderEnum } from "@/server/db/schema";
import { z } from "zod";

export const GetLandingPagesSchema = z.object({
  topic_id_filter: z.string().optional(),
  feed_provider_filter: z.enum(feedProviderEnum.enumValues).optional(),
});

export const CreateLandingPageSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  feed_provider: z.enum(feedProviderEnum.enumValues),
  max_daily_hits: z.number(),
  ip_frequency_cap: z.object({
    requests: z.number(),
    hours: z.number(),
  }),
  geo: z.string().optional(),
  device: z.enum(deviceEnum.enumValues),
  referrer_required: z.boolean(),
  topic_id: z.string(),
  traffic_ruleset_id: z.string(),
});

export const EditLandingPageSchema = z.object({
  landing_page_id: z.string(),
  name: z.string(),
  url: z.string().url(),
  feed_provider: z.enum(feedProviderEnum.enumValues),
  max_daily_hits: z.number(),
  ip_frequency_cap: z.object({
    requests: z.number(),
    hours: z.number(),
  }),
  geo: z.string().optional(),
  device: z.enum(deviceEnum.enumValues),
  referrer_required: z.boolean(),
  topic_id: z.string(),
  traffic_ruleset_id: z.string(),
});
