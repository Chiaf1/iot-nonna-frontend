// questo per comunicare a next che questo file contiene server actions ovvero
// funzioni chiamate dal brawser ma eseguite sul server, tutta la comunicazione server browser
// é gestita da next in automatico
"use server";

import { deleteDeviceSensor } from "@/services/sensors";
import { deleteDevice } from "@/services/device";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function removeSensorAction(deviceId: string, sensorId: string) {
  await deleteDeviceSensor(deviceId, sensorId);
  revalidatePath(`/devices/${deviceId}`);
}

export async function deleteDeviceAction(deviceId: string) {
  await deleteDevice(deviceId);
  redirect("/devices");
}
