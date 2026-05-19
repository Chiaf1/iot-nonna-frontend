import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getRoom } from "@/services/room";
import { notFound } from "next/navigation";
import { deleteRoomAction } from "./actions";
import { EditRoomForm } from "@/components/rooms/EditRoomForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function RoomsById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const room = await getRoom(id);

  if (!room) notFound();

  return (
    <div className="space-y-6">
      {/* Titolo pagina */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{room.name}</h1>
        </div>
      </div>

      {/* Griglia principale */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="text-base">
            <CardTitle>Dettagli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{room.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {room.id}
              </span>
            </div>
            <DeleteButton
              action={deleteRoomAction.bind(null, id)}
              label="Elimina stanza"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-base">
            <CardTitle>Modify room</CardTitle>
          </CardHeader>
          <CardContent>
            <EditRoomForm room={room} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
