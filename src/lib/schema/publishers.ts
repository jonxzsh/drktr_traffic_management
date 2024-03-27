import { z } from "zod";

export const CreatePublisherSchema = z.object({
  name: z.string(),
});
