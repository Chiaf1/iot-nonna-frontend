import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/api";
import {
  DeviceTypeRequest,
  DeviceTypeRequestSchema,
  DeviceTypeSchema,
  DeviceTypeListSchema,
} from "@/schemas/device_type.schema";
import { appConfig } from "@/lib/appConfig";

const baseURL = `${appConfig.api.url}/device-types`;

export const getDeviceTypes = () => apiGet(baseURL, DeviceTypeListSchema);

export const getDeviceType = (id: string) =>
  apiGet(`${baseURL}/${id}`, DeviceTypeSchema);

export const createDeviceType = (data: DeviceTypeRequest) =>
  apiPost(baseURL, DeviceTypeRequestSchema, DeviceTypeSchema, data);

export const updateDeviceType = (id: string, data: DeviceTypeRequest) =>
  apiPut(`${baseURL}/${id}`, DeviceTypeRequestSchema, DeviceTypeSchema, data);

export const delteDeviceType = (id: string) => apiDelete(`${baseURL}/${id}`);
