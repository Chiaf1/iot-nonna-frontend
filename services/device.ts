import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/api";
import {
  DeviceSchema,
  DeviceRequestSchema,
  DeviceRequest,
  DeviceListSchema,
} from "@/schemas/device.schema";
import { appConfig } from "@/lib/appConfig";

const baseURL = `${appConfig.api.url}/devices`;

export const getDevices = () => apiGet(baseURL, DeviceListSchema);

export const getDevice = (id: string) =>
  apiGet(`${baseURL}/${id}`, DeviceSchema);

export const createDevice = (data: DeviceRequest) =>
  apiPost(baseURL, DeviceRequestSchema, DeviceSchema, data);

export const updateDevice = (id: string, data: DeviceRequest) =>
  apiPut(`${baseURL}/${id}`, DeviceRequestSchema, DeviceSchema, data);

export const deleteDevice = (id: string) => apiDelete(`${baseURL}/${id}`);
