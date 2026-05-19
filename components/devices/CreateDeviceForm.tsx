"use client";

import { createDeviceAction } from "@/app/(app)/devices/actions";
import { DeviceType } from "@/schemas/device_type.schema";
import { Room } from "@/schemas/room.schema";
import { FormState } from "@/types/forms";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  deviceTypes: DeviceType[];
  rooms: Room[];
};

const initialState: FormState = {};

export function CreateDeviceForm({ deviceTypes, rooms }: Props) {
  const [state, formAction] = useActionState(createDeviceAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          name="code"
          type="text"
          placeholder="Inserisci nome device"
        />
        {state.errors?.code && (
          <p className="text-xs text-destructive">{state.errors.code[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="device_type_id">Tipo device</Label>
        <Select name="device_type_id">
          <SelectTrigger id="device_type_id">
            <SelectValue placeholder="Seleziona una tipologia di device" />
          </SelectTrigger>
          <SelectContent position="popper">
            {deviceTypes.map((dt) => (
              <SelectItem key={dt.id} value={dt.id}>
                {dt.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.device_type_id && (
          <p className="text-xs text-destructive">
            {state.errors.device_type_id[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="room_id">Stanza</Label>
        <Select name="room_id">
          <SelectTrigger id="room_id">
            <SelectValue placeholder="Seleziona una stanza (opzionale)" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="none">Nessuna stanza</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Crea Device</Button>
      {state.message && (
        <p className="text-xs text-muted-foreground text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
