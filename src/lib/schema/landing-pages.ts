import { deviceEnum } from "@/server/db/schema";
import { z } from "zod";

export const CreateLandingPageSchema = z.object({
  name: z.string(),
  url: z.string().url(),
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
