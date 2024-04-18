import { z } from "zod";

export const SetGlobalTrafficRulesSchema = z.object({
  block_http_traffic: z.boolean(),
  block_alternative_browsers: z.boolean(),
});
