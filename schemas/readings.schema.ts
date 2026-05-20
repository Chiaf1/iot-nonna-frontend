import { z } from "zod";

export const BaseReadingsSchema = z.object({
  id: z.string(),
  device_id: z.uuid(),
  sensor_id: z.uuid(),
  timestamp: z.iso.datetime({ offset: true }),
});

export const DhtReadingsSchema = BaseReadingsSchema.extend({
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
});

export const DhtReadingsListSchema = z.array(DhtReadingsSchema).nullable();

export const StatusReadingsSchema = BaseReadingsSchema.extend({
  status: z.boolean(),
});

export const StatusReadingsListSchema = z.array(StatusReadingsSchema);

export type DhtReadings = z.infer<typeof DhtReadingsSchema>;
export type StatusReadings = z.infer<typeof StatusReadingsSchema>;
