import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getRoom } from "@/services/room";
import { notFound } from "next/navigation";
import { deleteRoomAction } from "./actions";
import { EditRoomForm } from "@/components/rooms/EditRoomForm";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function RoomsById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const room = await getRoom(id);

  if (!room) notFound();

  return (
    <main className=" p-20 ">
      <h1>Room page</h1>
      <div>
        <h2>Room:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {
          <div key={room.id}>
            <h3>Device ID: {room.id}</h3>
            <pre>{JSON.stringify(room, null, 2)}</pre>
          </div>
        }
        <DeleteButton
          action={deleteRoomAction.bind(null, id)}
          label="Elimina stanza"
        />
      </div>
      <h2>Modifica Stanza</h2>
      <EditRoomForm room={room} />
    </main>
  );
}
