import { z } from "zod";

export const CreateTopicSchema = z.object({
  name: z.string(),
});
