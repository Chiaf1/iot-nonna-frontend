import { apiGet, apiPost } from "@/lib/api/api";
import {
  DeviceSchema,
  DeviceRequestSchema,
  DeviceRequest,
  DeviceListSchema,
} from "@/schemas/device.schema";
import { appConfig } from "@/lib/appConfig";
import { z } from "zod";

const baseURL = appConfig.api.url;

export const getDevices = () => apiGet(`${baseURL}/devices`, DeviceListSchema);

export const getDevice = (id: string) =>
  apiGet(`${baseURL}/devices/${id}`, DeviceSchema);

export const createDevice = (data: DeviceRequest) =>
  apiPost(`${baseURL}/devices`, DeviceRequestSchema, DeviceSchema, data);
