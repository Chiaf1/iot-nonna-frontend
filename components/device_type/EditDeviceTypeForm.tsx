"use client";

import { updateDeviceTypeAction } from "@/app/(app)/admin/device-types/[id]/actions";
import { DeviceType } from "@/schemas/device_type.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

type Props = {
  deviceType: DeviceType;
};

const initialState: FormState = {};

export function EditDeviceTypeForm({ deviceType }: Props) {
  const [state, formAction] = useActionState(
    updateDeviceTypeAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="device_type_id" value={deviceType.id} />
      <div>
        <label htmlFor="code">Code: </label>
        <input
          id="code"
          name="code"
          type="text"
          placeholder="Es. esp32-wroom"
          defaultValue={deviceType.code}
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.code && <p>{state.errors.code[0]}</p>}
      </div>
      <div>
        <label htmlFor="topic">Topic: </label>
        <input
          id="topic"
          name="topic"
          type="text"
          placeholder="Es. esp32"
          defaultValue={deviceType.topic}
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.topic && <p>{state.errors.topic[0]}</p>}
      </div>
      <div>
        <label htmlFor="description">Description: </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Es. Devkit esp 32 wroom 2"
          defaultValue={deviceType.description ?? ""}
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.description && <p>{state.errors.description[0]}</p>}
      </div>
      <button type="submit">Salva modifiche</button>
      {/* Messaggio di successo */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
