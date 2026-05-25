"use client";

import { createRoomAction } from "@/app/(app)/rooms/actions";
import { FormState } from "@/types/forms";
import { useActionState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  onSuccess?: () => void;
};

const initialState: FormState = {};

export function CreateRoomForm({ onSuccess }: Props) {
  // useActionState collega il form alla server acction
  // state = quello che la action ha ritornato (errori o messaggi)
  // formAction = la funzione da passare all'attributo action del form
  const [state, formAction] = useActionState(createRoomAction, initialState);

  useEffect(() => {
    if (state.message && !state.errors) onSuccess?.();
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name stanza</Label>
        <Input id="name" name="name" type="text" placeholder="Es. Soggiorno" />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.name.map((err, i) => (
          <p key={i} className="text-xs text-destructive">
            {err}
          </p>
        ))}
      </div>
      <Button type="submit">Crea stanza</Button>
      {/* Messaggio di successo */}
      {state.message && (
        <p className="text-xs text-muted-foreground text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
