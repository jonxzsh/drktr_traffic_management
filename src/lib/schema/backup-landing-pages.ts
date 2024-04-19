import { deviceEnum } from "@/server/db/schema";
import { z } from "zod";

export const CreateBackupLandingPageSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  device: z.enum(deviceEnum.enumValues),
  max_daily_hits: z.number(),
});

export const EditBackupLandingPageSchema = z.object({
  landing_page_id: z.string(),
  name: z.string(),
  url: z.string().url(),
  device: z.enum(deviceEnum.enumValues),
  max_daily_hits: z.number(),
});
