import { Room } from "@/schemas/room.schema";
import { getRooms } from "@/services/room";
import { RoomCardSimple } from "@/components/rooms/RoomCardSimple";
import { RoomsPageClient } from "@/components/rooms/RoomsPageClient";

export default async function Rooms() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <RoomsPageClient />
      </div>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {rooms.map((room: Room) => (
          <RoomCardSimple key={room.id} room={room} />
        ))}
        {/* se non trova nessun dispositivo */}
        {rooms.length === 0 && <p>Nessuna stanza trovato</p>}
      </div>
    </div>
  );
}
