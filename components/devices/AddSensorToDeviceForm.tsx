"use client";

import { addSensorToDeviceAction } from "@/app/(app)/devices/[id]/actions";
import { SensorType } from "@/schemas/sensor_type.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="device_id" value={deviceId} />
      <div className="space-y-1.5">
        <Label htmlFor="sensor_id">Sensore</Label>
        <Select name="sensor_id">
          <SelectTrigger id="sensor_id">
            <SelectValue placeholder="Seleziona un sensore" />
          </SelectTrigger>
          <SelectContent position="popper">
            {sensorsAvailable.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.sensor_id && (
          <p className="text-xs text-destructive">
            {state.errors.sensor_id[0]}
          </p>
        )}
      </div>
      <Button type="submit" size="sm" variant="outline" className="w-full">
        Aggiungi
      </Button>
      {state.message && (
        <p className="text-xs text-muted-foreground text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
