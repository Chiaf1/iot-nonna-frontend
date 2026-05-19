"use server";

import { z } from "zod";
import { FormState } from "@/types/forms";
import { revalidatePath } from "next/cache";
import { createSensorType } from "@/services/sensor_type";
import { SensorTypeRequestSchema } from "@/schemas/sensor_type.schema";

export async function createSensorTypeActions(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    code: formData.get("code")?.toString() ?? "",
    topic: formData.get("topic")?.toString() ?? "",
    description: formData.get("description") || null,
    readings_table_name: formData.get("readings_table_name")?.toString() ?? "",
    value_mapping: formData.get("value_mapping") || null,
    payload_format: formData.get("payload_format")?.toString() ?? "",
    qos_mqtt: formData.get("qos_mqtt")?.toString() ?? "",
  };
  const result = SensorTypeRequestSchema.safeParse(raw);
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }
  await createSensorType(result.data);
  revalidatePath("/sensor-types");
  return { message: "Sensor type creato con successo" };
}
