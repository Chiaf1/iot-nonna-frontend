"use server";

import { deleteSensorType } from "@/services/sensor_type";
import { redirect } from "next/navigation";

export async function deleteSensorTypeAction(id: string) {
  await deleteSensorType(id);
  redirect("/admin/sensor-types");
}
