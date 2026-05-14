import { z } from "zod";
import { DeviceTypeSchema } from "./device_type.schema";
import { RoomSchema } from "./room.schema";

export const DeviceSchema = z.object({
  id: z.string(),
  code: z.string(),
  device_type: DeviceTypeSchema,
  room: RoomSchema.optional().nullable(),
  created_at: z.iso.datetime({ offset: true }),
});

export const DeviceRequestSchema = z.object({
  code: z.string().min(1).max(50, "too long"),
  device_type_id: z.uuid().min(1),
  room_id: z.uuid().optional().nullable(),
});

export const DeviceListSchema = z.array(DeviceSchema);

export type Device = z.infer<typeof DeviceSchema>;
export type DeviceRequest = z.infer<typeof DeviceRequestSchema>;
