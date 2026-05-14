import { z } from "zod";
import { SensorTypeSchema } from "./sensor_type.schema";

export const SensorDevicesSchema = z.object({
  device_id: z.string(),
  sensor: SensorTypeSchema,
});

export const AssociateSensorRequestSchema = z.object({
  sensor_id: z.uuid().min(1),
});

export type SensorDevices = z.infer<typeof SensorDevicesSchema>;
export type AssociateSensorRequest = z.infer<
  typeof AssociateSensorRequestSchema
>;
