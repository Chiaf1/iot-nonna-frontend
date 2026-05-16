"use client";

import { removeSensorAction } from "@/app/(app)/devices/[id]/actions";

type Props = {
  deviceId: string;
  sensorId: string;
};

export function RemoveSensorButton({ deviceId, sensorId }: Props) {
  return (
    <button onClick={() => removeSensorAction(deviceId, sensorId)}>
      Rimuovi
    </button>
  );
}
