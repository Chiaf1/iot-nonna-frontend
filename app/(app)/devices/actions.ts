"use server";

import { DeviceRequestSchema } from "@/schemas/device.schema";
import { createDevice } from "@/services/device";
import { FormState } from "@/types/forms";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createDeviceAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    code: formData.get("code")?.toString() ?? "",
    device_type_id: formData.get("device_type_id")?.toString() ?? "",
    room_id: formData.get("room_id")?.toString() || undefined, // se stringa vuota lo converte in undefined
  };

  const result = DeviceRequestSchema.safeParse(raw);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  await createDevice(result.data);
  // revalidatePath("/devices"); l'ho tolto perchè andava in conflitto con la dialog
  return { message: "Device creato con successo" };
}
