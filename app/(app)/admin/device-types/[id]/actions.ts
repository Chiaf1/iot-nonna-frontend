"use server";

import { deleteDeviceType } from "@/services/device_type";
import { redirect } from "next/navigation";

export async function deleteDeviceTypeAction(id: string) {
  await deleteDeviceType(id);
  redirect("/admin/device-types");
}
