import { Room } from "@/schemas/room.schema";
import { getRooms } from "@/services/room";

export default async function Dashboard() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const rooms = await getRooms();

  return (
    <main className=" p-20 ">
      <h1>Room page</h1>
      <div>
        <h2>Rooms:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {rooms.map((room: Room) => (
          <div key={room.id}>
            <h3>Room ID: {room.id}</h3>
            <pre>{JSON.stringify(room, null, 2)}</pre>
          </div>
        ))}
        {/* se non trova nessun dispositivo */}
        {rooms.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
