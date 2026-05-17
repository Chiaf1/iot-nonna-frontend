import { z } from "zod";

const ColumnSchemaTypeSchema = z.object({
  column: z.string(),
  type: z.enum(["float", "int", "bool", "string"]),
});

export const SensorTypeRequestSchema = z
  .object({
    code: z.string().min(1),
    topic: z.string().min(1).max(50),
    description: z.string().optional().nullable(),
    readings_table_name: z.string().min(1),
    column_schema: z
      .record(z.string(), ColumnSchemaTypeSchema)
      .refine((obj) => Object.keys(obj).length >= 1, {
        message: "column_schema must have at least one entry",
      }),
    value_mapping: z.unknown().optional(),
    payload_format: z.enum(["json", "raw"]),
    qos_mqtt: z.number().int().min(0).max(2).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // 1. Check empty keys
    for (const key of Object.keys(data.column_schema)) {
      if (key.trim() == "") {
        ctx.addIssue({
          code: "custom",
          message: "empty_key",
          path: ["column_schema"],
        });
        return;
      }
    }
    // 2. If not row stop
    if (data.payload_format !== "raw") return;

    //3. Must have 1 entry
    const cs = data.column_schema;
    if (Object.keys(cs).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "colum_schema required",
        path: ["column_schema"],
      });
      return;
    }
    // 4. Must have $payload
    const payload = cs["$payload"];
    if (!payload) {
      ctx.addIssue({
        code: "custom",
        message: "payload_required",
        path: ["column_schema"],
      });
      return;
    }
    // 5. bool + raw = must have value_mapping
    if (
      payload.type === "bool" &&
      (data.value_mapping === undefined || data.value_mapping === null)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "required_for_bool_raw",
        path: ["value_mapping"],
      });
    }
  });

export const SensorTypeSchema = SensorTypeRequestSchema.extend({
  id: z.string(),
});

export const SensorTypeListSchema = z.array(SensorTypeSchema).nullable();

export type SensorTypeRequest = z.infer<typeof SensorTypeRequestSchema>;
export type SensorType = z.infer<typeof SensorTypeSchema>;
export type ColumnSchemaType = z.infer<typeof ColumnSchemaTypeSchema>;
