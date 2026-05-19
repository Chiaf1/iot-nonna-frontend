"use client";

import { createDeviceTypeAction } from "@/app/(app)/admin/device-types/actions";
import { FormState } from "@/types/forms";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const initialState: FormState = {};

export function CreateDeviceTypeForm() {
  const [state, formAction] = useActionState(
    createDeviceTypeAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          name="code"
          type="text"
          placeholder="Es. esp32-wroom"
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.code && (
          <p className="text-xs text-destructive">{state.errors.code[0]}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" name="topic" type="text" placeholder="Es. esp32" />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.topic && (
          <p className="text-xs text-destructive">{state.errors.topic[0]}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Input device type description (optional)"
        />
        {/* Mostra l'errore di validazione se c'è */}
        {state.errors?.description && (
          <p className="text-xs text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>
      <Button type="submit">Crea DeviceType</Button>
      {/* Messaggio di successo */}
      {state.message && (
        <p className="text-xs text-muted-foreground text-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
