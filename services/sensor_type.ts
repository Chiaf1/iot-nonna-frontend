import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/api";
import {
  SensorTypeRequest,
  SensorTypeRequestSchema,
  SensorTypeSchema,
  SensorTypeListSchema,
} from "@/schemas/sensor_type.schema";
import { appConfig } from "@/lib/appConfig";

const baseURL = `${appConfig.api.url}/sensor-types`;

export const getSensorTypes = () => apiGet(baseURL, SensorTypeListSchema);

export const getSensorType = (id: string) =>
  apiGet(`${baseURL}/${id}`, SensorTypeSchema);

export const createSensorType = (data: SensorTypeRequest) =>
  apiPost(baseURL, SensorTypeRequestSchema, SensorTypeSchema, data);

export const updateSensorType = (id: string, data: SensorTypeRequest) =>
  apiPut(`${baseURL}/${id}`, SensorTypeRequestSchema, SensorTypeSchema, data);

export const deleteSensorType = (id: string) => apiDelete(`${baseURL}/${id}`);
