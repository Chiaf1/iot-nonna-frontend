"use client";

import { createDeviceTypeAction } from "@/app/(app)/admin/device-types/actions";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

const initialState: FormState = {};

export function CreateDeviceTypeForm() {
  const [state, formAction] = useActionState(
    createDeviceTypeAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="code">Code</label>
        <input
          id="code"
          name="code"
          type="text"
          placeholder="Es. esp32-wroom"
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.code && <p>{state.errors.code[0]}</p>}
      </div>
      <div>
        <label htmlFor="topic">Topic</label>
        <input id="topic" name="topic" type="text" placeholder="Es. esp32" />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.topic && <p>{state.errors.topic[0]}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Es. Devkit esp 32 wroom 2"
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.description && <p>{state.errors.description[0]}</p>}
      </div>
      <button type="submit">Crea DeviceType</button>
      {/* Messaggio di successo */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
