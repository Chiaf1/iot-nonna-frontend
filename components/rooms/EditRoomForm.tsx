"use client";

import { updateRoomAction } from "@/app/(app)/rooms/[id]/actions";
import { Room } from "@/schemas/room.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  room: Room;
};

const initialState: FormState = {};

export function EditRoomForm({ room }: Props) {
  const [state, formAction] = useActionState(updateRoomAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <input type="hidden" name="room_id" value={room.id} />
        <Label htmlFor="name">Name stanza: </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Es. Soggiorno"
          defaultValue={room.name}
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.name.map((err, i) => (
          <p key={i} className="text-xs text-destructive">
            {err}
          </p>
        ))}
      </div>
      <Button type="submit">Salva modifiche</Button>
      {/* Messaggio di successo */}
      {state.message && (
        <p className="text-xs text-muted-foreground text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
