import { z } from "zod";

export const RoomRequestSchema = z.object({
  name: z.string().min(1),
});

export const RoomSchema = RoomRequestSchema.extend({
  id: z.string(),
});

export type RoomRequest = z.infer<typeof RoomRequestSchema>;
export type Room = z.infer<typeof RoomSchema>;
