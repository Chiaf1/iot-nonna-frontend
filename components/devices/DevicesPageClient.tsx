"use client";

import { CreateDeviceDialog } from "@/components/devices/CreateDeviceDialog";
import { DeviceType } from "@/schemas/device_type.schema";
import { Room } from "@/schemas/room.schema";
import { AutoRefresh } from "../ui_personal/AutoRefresh";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  deviceTypes: DeviceType[];
  rooms: Room[];
};

export function DevicesPageClient({ deviceTypes, rooms }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AutoRefresh intervalSeconds={30} disabled={dialogOpen} />
      <CreateDeviceDialog
        deviceTypes={deviceTypes}
        rooms={rooms}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
