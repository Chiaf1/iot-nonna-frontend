import { z } from "zod";

export const DeviceTypeRequestSchema = z.object({
  code: z.string().min(1),
  topic: z.string().min(1).max(50, "too long"),
  description: z.string().optional().nullable(),
});

export const DeviceTypeSchema = DeviceTypeRequestSchema.extend({
  id: z.string(),
});

export const DeviceTypeListSchema = z.array(DeviceTypeSchema);

export type DeviceTypeRequest = z.infer<typeof DeviceTypeRequestSchema>;
export type DeviceType = z.infer<typeof DeviceTypeSchema>;
