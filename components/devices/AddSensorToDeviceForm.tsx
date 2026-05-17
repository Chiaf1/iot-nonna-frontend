"use client";

import { addSensorToDeviceAction } from "@/app/(app)/devices/[id]/actions";
import { SensorType } from "@/schemas/sensor_type.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";

type Props = {
  deviceId: string;
  sensorsAvailable: SensorType[];
};

const initialState: FormState = {};

export function AddSensorToDeviceForm({ deviceId, sensorsAvailable }: Props) {
  const [state, formAction] = useActionState(
    addSensorToDeviceAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="device_id" value={deviceId} />
      <div>
        <label htmlFor="sensor_id">Sensor to add: </label>
        <select id="sensor_id" name="sensor_id">
          {sensorsAvailable.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code}
            </option>
          ))}
        </select>
        {state.errors?.sensor_id && <p>{state.errors.sensor_id[0]}</p>}
      </div>
      <button type="submit">Add sensor</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
