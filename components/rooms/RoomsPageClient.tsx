"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomDialog } from "./CreateRoomDialog";

export function RoomsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <CreateRoomDialog
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
