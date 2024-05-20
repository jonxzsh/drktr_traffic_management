import { z } from "zod";

export const GetPublishersSchema = z.object({
  topic_id_filter: z.string().optional(),
});

export const EditPublisherSchema = z.object({
  publisher_id: z.string(),
  fb_business_manager_id: z.string().optional(),
  active: z.boolean().optional(),
});

export const CreatePublisherSchema = z.object({
  name: z.string(),
});

export const AssignPublisherTopicSchema = z.object({
  publisher_id: z.string(),
  topic_id: z.string(),
});

export const RemovePublisherTopicSchema = z.object({
  publisher_topic_relation_id: z.string(),
});
