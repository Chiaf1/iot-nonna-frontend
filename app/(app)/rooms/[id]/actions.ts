"use server";

import { deleteRoom, updateRoom } from "@/services/room";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FormState } from "@/types/forms";
import { revalidatePath } from "next/cache";
import { RoomRequestSchema } from "@/schemas/room.schema";

export async function deleteRoomAction(id: string) {
  await deleteRoom(id);
  redirect("/rooms");
}

export async function updateRoomAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const roomId = formData.get("room_id")?.toString() ?? "";
  const raw = {
    name: formData.get("name")?.toString() ?? "",
  };
  const result = RoomRequestSchema.safeParse(raw);
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  await updateRoom(roomId, result.data);
  revalidatePath(`/rooms/${roomId}`);
  return { message: "Stanza modificata con successo" };
}
