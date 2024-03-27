import { deviceEnum } from "@/server/db/schema";
import { z } from "zod";

export const CreateTrafficRulesetSchema = z.object({
  name: z.string(),
  referrer_domains_allowed: z.string().array(),
  referrer_required_parameters: z.string().array(),
  device: z.enum(deviceEnum.enumValues),
});
