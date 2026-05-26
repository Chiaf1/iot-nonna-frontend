"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateDevicetypeDialog } from "./CreateDevicetypeDialog";

export function DevicetypePageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <CreateDevicetypeDialog
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
