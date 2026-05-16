"use client";

import { createDeviceAction } from "@/app/(app)/devices/actions";
import { DeviceType } from "@/schemas/device_type.schema";
import { Room } from "@/schemas/room.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

type Props = {
  deviceTypes: DeviceType[];
  rooms: Room[];
};

const initialState: FormState = {};

export function CreateDeviceForm({ deviceTypes, rooms }: Props) {
  const [state, formAction] = useActionState(createDeviceAction, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="code">Code</label>
        <input id="code" name="code" type="text" />
        {state.errors?.code && <p>{state.errors.code[0]}</p>}
      </div>

      <div>
        <label htmlFor="device_type_id">Tipo device</label>
        <select id="device_type_id" name="device_type_id">
          {deviceTypes.map((dt) => (
            <option key={dt.id} value={dt.id}>
              {dt.code}
            </option>
          ))}
        </select>
        {state.errors?.device_type_id && (
          <p>{state.errors.device_type_id[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="room_id">Stanza (opzionale)</label>
        <select id="room_id" name="room_id">
          {/* Opzione vuota per "nessuna stanza" */}
          <option value="">Nessuna stanza</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Crea Device</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
