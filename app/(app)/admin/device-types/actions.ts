"use server";

import { DeviceTypeRequestSchema } from "@/schemas/device_type.schema";
import { z } from "zod";
import { FormState } from "@/types/forms";
import { createDeviceType } from "@/services/device_type";
import { revalidatePath } from "next/cache";

export async function createDeviceTypeAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Estrai i valori da FormData
  const raw = {
    code: formData.get("code")?.toString() ?? "",
    topic: formData.get("topic")?.toString() ?? "",
    description: formData.get("description") || null,
  };

  // Validazione con zod
  const result = DeviceTypeRequestSchema.safeParse(raw);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  await createDeviceType(result.data);
  revalidatePath("/device-types");
  return { message: "Device type creato con successo" };
}
