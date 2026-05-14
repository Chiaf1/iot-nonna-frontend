import {
  apiDelete,
  apiGet,
  apiPost,
  apiPostNoContent,
  apiPut,
} from "@/lib/api/api";
import {
  DeviceTypeRequest,
  DeviceTypeRequestSchema,
  DeviceTypeSchema,
  DeviceTypeListSchema,
} from "@/schemas/device_type.schema";
import { appConfig } from "@/lib/appConfig";
import { SensorTypeListSchema } from "@/schemas/sensor_type.schema";
import {
  AssociateSensorRequest,
  AssociateSensorRequestSchema,
} from "@/schemas/sensors_devices.schema";

const baseURL = `${appConfig.api.url}/device-types`;

export const getDeviceTypes = () => apiGet(baseURL, DeviceTypeListSchema);

export const getDeviceType = (id: string) =>
  apiGet(`${baseURL}/${id}`, DeviceTypeSchema);

export const createDeviceType = (data: DeviceTypeRequest) =>
  apiPost(baseURL, DeviceTypeRequestSchema, DeviceTypeSchema, data);

export const updateDeviceType = (id: string, data: DeviceTypeRequest) =>
  apiPut(`${baseURL}/${id}`, DeviceTypeRequestSchema, DeviceTypeSchema, data);

export const delteDeviceType = (id: string) => apiDelete(`${baseURL}/${id}`);

// Devices's sensors
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
