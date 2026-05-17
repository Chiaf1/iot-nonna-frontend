"use client";

import { updateRoomAction } from "@/app/(app)/rooms/[id]/actions";
import { Room } from "@/schemas/room.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

type Props = {
  room: Room;
};

const initialState: FormState = {};

export function EditRoomForm({ room }: Props) {
  const [state, formAction] = useActionState(updateRoomAction, initialState);

  return (
    <form action={formAction}>
      <div>
        <input type="hidden" name="room_id" value={room.id} />
        <label htmlFor="name">Name stanza: </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Es. Soggiorno"
          defaultValue={room.name}
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.name.map((err, i) => (
          <p key={i}>{err}</p>
        ))}
      </div>
      <button type="submit">Salva modifiche</button>
      {/* Messaggio di successo */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
