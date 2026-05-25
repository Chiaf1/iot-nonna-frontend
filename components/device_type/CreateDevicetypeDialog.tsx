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
import { CreateDeviceTypeForm } from "./CreateDeviceTypeForm";

export function CreateDevicetypeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Aggiungi device type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo DeviceType</DialogTitle>
        </DialogHeader>
        <CreateDeviceTypeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
