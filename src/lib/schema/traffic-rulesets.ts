import { deviceEnum } from "@/server/db/schema";
import { z } from "zod";

export const CreateTrafficRulesetSchema = z.object({
  name: z.string(),
  referrer_domains_allowed: z
    .object({ id: z.string(), value: z.string() })
    .array(),
  referrer_required_parameters: z
    .object({ id: z.string(), value: z.string() })
    .array(),
  referrer_url_min_length: z.number(),
  device: z.enum(deviceEnum.enumValues),
  no_referer_allowed: z.boolean(),
});

export const EditTrafficRulesetSchema = z.object({
  ruleset_id: z.string(),
  name: z.string(),
  referrer_domains_allowed: z
    .object({ id: z.string(), value: z.string() })
    .array(),
  referrer_required_parameters: z
    .object({ id: z.string(), value: z.string() })
    .array(),
  referrer_url_min_length: z.number(),
  device: z.enum(deviceEnum.enumValues),
  no_referer_allowed: z.boolean(),
});
