import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/api";
import {
  RoomListSchema,
  RoomRequest,
  RoomRequestSchema,
  RoomSchema,
} from "@/schemas/room.schema";
import { appConfig } from "@/lib/appConfig";

const baseURL = `${appConfig.api.url}/rooms`;

export const getRooms = () => apiGet(baseURL, RoomListSchema);

export const getRoom = (id: string) => apiGet(`${baseURL}/${id}`, RoomSchema);

export const createRoom = (data: RoomRequest) =>
  apiPost(baseURL, RoomRequestSchema, RoomSchema, data);

export const updateRoom = (id: string, data: RoomRequest) =>
  apiPut(`${baseURL}/${id}`, RoomRequestSchema, RoomSchema, data);

export const deleteRoom = (id: string) => apiDelete(`${baseURL}/${id}`);
