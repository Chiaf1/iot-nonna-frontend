import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Device } from "@/schemas/device.schema";
import { DhtReadings, StatusReadings } from "@/schemas/readings.schema";
import Link from "next/link";
import { Droplet, Thermometer } from "lucide-react";

type Props = {
  device: Device;
  latestDht: DhtReadings | null;
  latestStatus: StatusReadings | null;
};

export function DeviceCard({ device, latestDht, latestStatus }: Props) {
  const isOnline = latestStatus?.status ?? null;

  return (
    <Link href={`/devices/${device.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-0.5 pb-1">
          {/* Header: nome + stato */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-medium text-sm">{device.code}</p>
              <p className="text-xs text-muted-foreground">
                {device.device_type.code}
              </p>
            </div>

            {isOnline === null ? (
              <Badge variant="outline">Sconosciuto</Badge>
            ) : isOnline ? (
              <Badge variant="success">Online</Badge>
            ) : (
              <Badge variant="destructive">Offline</Badge>
            )}
          </div>

          {/* Lettura DHT */}
          {latestDht ? (
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm">
                <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{latestDht.temperature?.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Droplet className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{latestDht.humidity?.toFixed(1)}%</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">
              Nessuna lettura
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
