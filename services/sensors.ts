import { apiDelete, apiGet, apiPostNoContent } from "@/lib/api/api";
import { SensorTypeListSchema } from "@/schemas/sensor_type.schema";
import {
  AssociateSensorRequest,
  AssociateSensorRequestSchema,
} from "@/schemas/sensors_devices.schema";
import { appConfig } from "@/lib/appConfig";

// Devices's sensors
const baseURL = `${appConfig.api.url}/devices`;
const sensorURL = "/sensors";

export const getDeviceSensors = (id: string) =>
  apiGet(`${baseURL}/${id}${sensorURL}`, SensorTypeListSchema);

export const postDeviceSensor = (id: string, data: AssociateSensorRequest) =>
  apiPostNoContent(
    `${baseURL}/${id}${sensorURL}`,
    AssociateSensorRequestSchema,
    data,
  );

export const deleteDeviceSensor = (deviceId: string, sensorId: string) =>
  apiDelete(`${baseURL}/${deviceId}${sensorURL}/${sensorId}`);
