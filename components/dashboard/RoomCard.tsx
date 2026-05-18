import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceWithReading } from "@/types/dashboard";
import { DeviceCard } from "./DeviceCard";
import Link from "next/link";

type Props = {
  roomName: string | null;
  devices: DeviceWithReading[];
};

export function RoomCard({ roomName, devices }: Props) {
  // "Senza stanza" ha bordo tratteggiato per distinguerla visivamente
  const isUnassigned = roomName === null;

  return (
    <Card
      className={
        isUnassigned
          ? "border border-dashed border-muted-foreground/50"
          : "border"
      }
    >
      <CardHeader className="pb-3">
        <CardTitle className="test-base">
          {isUnassigned ? (
            "Senza stanza"
          ) : (
            <Link
              href={`/rooms/${devices[0].device.room?.id}`}
              className="hover:underline"
            >
              {roomName}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {devices.map(({ device, latestDht, latestStatus }) => (
            <DeviceCard
              key={device.id}
              device={device}
              latestDht={latestDht}
              latestStatus={latestStatus}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
