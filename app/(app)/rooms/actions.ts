"use server";

import { RoomRequestSchema } from "@/schemas/room.schema";
import { createRoom } from "@/services/room";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FormState } from "@/types/forms";

// Le server action usato con useActionState devono avere questa firma:
// (prevState: State, ...args) => Promise<State>
// nel nostro caso siccome é collegata ad un form il dato che arriva da useActionState sarà di tipo FormData

export async function createRoomAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Estrai i valori dalla form data
  const raw = {
    name: formData.get("name"),
  };

  // Valida con zod
  const result = RoomRequestSchema.safeParse(raw);

  if (!result.success) {
    // zod da già gli errori per campo, basta passarli al componente
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  await createRoom(result.data);
  // revalidatePath("/rooms"); l'ho tolto perchè andava in conflitto con la dialog
  return { message: "Stanza creata con successo" };
}
