"use server";

import { DeviceTypeRequestSchema } from "@/schemas/device_type.schema";
import { deleteDeviceType, updateDeviceType } from "@/services/device_type";
import { FormState } from "@/types/forms";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function deleteDeviceTypeAction(id: string) {
  await deleteDeviceType(id);
  redirect("/admin/device-types");
}

export async function updateDeviceTypeAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const dtId = formData.get("device_type_id")?.toString() ?? "";
  const raw = {
    code: formData.get("code")?.toString() ?? "",
    topic: formData.get("topic")?.toString() ?? "",
    description: formData.get("description") || null,
  };
  const result = DeviceTypeRequestSchema.safeParse(raw);
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  await updateDeviceType(dtId, result.data);
  revalidatePath(`/device-types/${dtId}`);
  return { message: "Device type modificato con successo" };
}
