"use client";

import { updateDeviceAction } from "@/app/(app)/devices/[id]/actions";
import { Device } from "@/schemas/device.schema";
import { DeviceType } from "@/schemas/device_type.schema";
import { Room } from "@/schemas/room.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

type Props = {
  device: Device;
  deviceTypes: DeviceType[];
  rooms: Room[];
};

const initialState: FormState = {};

export function EditDeviceForm({ device, deviceTypes, rooms }: Props) {
  const [state, formAction] = useActionState(updateDeviceAction, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="device_id" value={device.id} />
      <div>
        <label htmlFor="code">Code: </label>
        <input id="code" name="code" type="text" defaultValue={device.code} />
        {state.errors?.code && <p>{state.errors.code[0]}</p>}
      </div>

      <div>
        <label htmlFor="device_type_id">Tipo device: </label>
        <select
          id="device_type_id"
          name="device_type_id"
          defaultValue={device.device_type.id}
        >
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
        <label htmlFor="room_id">Stanza (opzionale): </label>
        <select
          id="room_id"
          name="room_id"
          defaultValue={device.room?.id ?? ""}
        >
          {/* Opzione vuota per "nessuna stanza" */}
          <option value="">Nessuna stanza</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Salva modifiche</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
