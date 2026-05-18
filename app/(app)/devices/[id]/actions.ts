// questo per comunicare a next che questo file contiene server actions ovvero
// funzioni chiamate dal brawser ma eseguite sul server, tutta la comunicazione server browser
// é gestita da next in automatico
"use server";

import { deleteDeviceSensor, postDeviceSensor } from "@/services/sensors";
import { deleteDevice, updateDevice } from "@/services/device";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "@/types/forms";
import { z } from "zod";
import { AssociateSensorRequestSchema } from "@/schemas/sensors_devices.schema";
import { DeviceRequestSchema } from "@/schemas/device.schema";

export async function removeSensorAction(deviceId: string, sensorId: string) {
  await deleteDeviceSensor(deviceId, sensorId);
  revalidatePath(`/devices/${deviceId}`);
}

export async function deleteDeviceAction(deviceId: string) {
  await deleteDevice(deviceId);
  redirect("/devices");
}

export async function addSensorToDeviceAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const deviceId = formData.get("device_id")?.toString() ?? "";
  const raw = { sensor_id: formData.get("sensor_id")?.toString() ?? "" };
  const result = AssociateSensorRequestSchema.safeParse(raw);
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  await postDeviceSensor(deviceId, result.data);
  revalidatePath(`/devices/${deviceId}`);
  return { message: "Sensore aggiunto con successo" };
}

export async function updateDeviceAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const deviceId = formData.get("device_id")?.toString() ?? "";
  const raw = {
    code: formData.get("code")?.toString() ?? "",
    device_type_id: formData.get("device_type_id")?.toString() ?? "",
    room_id:
      formData.get("room_id")?.toString().replace("none", "") || undefined,
  };
  const result = DeviceRequestSchema.safeParse(raw);
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  await updateDevice(deviceId, result.data);
  revalidatePath(`/devices/${deviceId}`);
  return { message: "Device modificato con successo" };
}
