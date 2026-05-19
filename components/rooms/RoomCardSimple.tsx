import { Card, CardContent } from "@/components/ui/card";
import { Room } from "@/schemas/room.schema";
import Link from "next/link";
import { Tag } from "lucide-react";

type Props = {
  room: Room;
};

export function RoomCardSimple({ room }: Props) {
  return (
    <Card>
      <CardContent>
        <Link href={`/rooms/${room.id}`} className="grid grid-cols-1 gap-1">
          <p className="font-medium text-sm hover:underline">{room.name}</p>
          <div className="text-xs flex flex-row items-center gap-1">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-xs text-muted-foreground">
              {room.id}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
