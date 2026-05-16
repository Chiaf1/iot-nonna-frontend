"use client";

import { createRoomAction, FormState } from "@/app/(app)/rooms/actions";
import { useActionState } from "react";

const initialState: FormState = {};

export function CreateRoomForm() {
  // useActionState collega il form alla server acction
  // state = quello che la action ha ritornato (errori o messaggi)
  // formAction = la funzione da passare all'attributo action del form
  const [state, formAction] = useActionState(createRoomAction, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name stanza</label>
        <input id="name" name="name" type="text" placeholder="Es. Soggiorno" />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.name.map((err, i) => (
          <p key={i}>{err}</p>
        ))}
      </div>
      <button type="submit">Crea stanza</button>
      {/* Messaggio di successo */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
