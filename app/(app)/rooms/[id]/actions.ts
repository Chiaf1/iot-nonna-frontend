"use server";

import { deleteRoom } from "@/services/room";
import { redirect } from "next/navigation";

export async function deleteRoomAction(id: string) {
  await deleteRoom(id);
  redirect("/rooms");
}
