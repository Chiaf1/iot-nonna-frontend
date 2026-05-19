import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { Room } from "@/schemas/room.schema";
import { getRooms } from "@/services/room";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoomCardSimple } from "@/components/rooms/RoomCardSimple";

export default async function Rooms() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Rooms</h1>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {rooms.map((room: Room) => (
          <RoomCardSimple key={room.id} room={room} />
        ))}
        {/* se non trova nessun dispositivo */}
        {rooms.length === 0 && <p>Nessuna stanza trovato</p>}
      </div>
      <Separator />
      <Card>
        <CardHeader className="text-base">Aggiungi Stanza</CardHeader>
        <CardContent>
          <CreateRoomForm />
        </CardContent>
      </Card>
    </div>
  );
}
