import { apiGet } from "@/lib/api/api";
import { appConfig } from "@/lib/appConfig";
import {
  DhtReadingsListSchema,
  DhtReadingsSchema,
  StatusReadingsListSchema,
  StatusReadingsSchema,
} from "@/schemas/readings.schema";

const baseURL = `${appConfig.api.url}/readings`;

type GetReadingsParams = {
  from?: string;
  to?: string;
  limit?: string;
};

// DHT

const baseDHT = `${baseURL}/dht`;

export const getReadingsRangeDht = (id: string, params?: GetReadingsParams) => {
  const search = new URLSearchParams();

  if (params?.from) search.append("from", params.from);
  if (params?.to) search.append("to", params.to);
  if (params?.limit) search.append("limit", params.limit);

  const url = `${baseDHT}/${id}${search.toString() ? `?${search.toString()}` : ""}`;
  return apiGet(url, DhtReadingsListSchema);
};

export const getReadingsLatestDht = (id: string) =>
  apiGet(`${baseDHT}/${id}/latest`, DhtReadingsSchema);

// Status

const baseStatus = `${baseURL}/status`;

export const getReadingsRangeStatus = (
  id: string,
  params?: GetReadingsParams,
) => {
  const search = new URLSearchParams();

  if (params?.from) search.append("from", params.from);
  if (params?.to) search.append("to", params.to);
  if (params?.limit) search.append("limit", params.limit);

  const url = `${baseStatus}/${id}${search.toString() ? `?${search.toString()}` : ""}`;

  return apiGet(url, StatusReadingsListSchema);
};

export const getReadingsLatestStatus = (id: string) =>
  apiGet(`${baseStatus}/${id}/latest`, StatusReadingsSchema);
