"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CreateDeviceForm } from "./CreateDeviceForm";
import { DeviceType } from "@/schemas/device_type.schema";
import { Room } from "@/schemas/room.schema";

type Props = {
  deviceTypes: DeviceType[];
  rooms: Room[];
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CreateDeviceDialog({
  deviceTypes,
  rooms,
  onOpenChange,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChange?.(v);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Aggiungi device
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo Device</DialogTitle>
        </DialogHeader>
        <CreateDeviceForm
          deviceTypes={deviceTypes}
          rooms={rooms}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
