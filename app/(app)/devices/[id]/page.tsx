import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getDevice } from "@/services/device";
import {
  getReadingsLatestDht,
  getReadingsLatestStatus,
} from "@/services/readings";
import { getRooms } from "@/services/room";
import { getSensorTypes } from "@/services/sensor_type";
import { getDeviceSensors } from "@/services/sensors";
import { notFound } from "next/navigation";
import { deleteDeviceAction, removeSensorAction } from "./actions";
import { AddSensorToDeviceForm } from "@/components/devices/AddSensorToDeviceForm";
import { getDeviceTypes } from "@/services/device_type";
import { EditDeviceForm } from "@/components/devices/EditDeviceForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cpu, Droplet, MapPin, Tag, Thermometer, Radio } from "lucide-react";
import Link from "next/link";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function DevicesById({ params }: RouteParams) {
  const { id } = await params;
  // Fetch del device prima di tutto, perché se non esiste non ha senso adare avanti
  const device = await getDevice(id).catch(() => null);
  if (!device) notFound();

  // Fetch parallelo non in sequenza, le varie chiamate partono insieme invece che in sequenza
  // ho dovuto aggiungere .catch(() => null) a latestDht e status perché é possibile
  // che un dispositivo nuovo non abbia letture quindi un errore (404) legittimo
  const [
    deviceSensors,
    rooms,
    allSensors,
    latestDht,
    latestStatus,
    deviceTypes,
  ] = await Promise.all([
    getDeviceSensors(id).catch(() => null),
    getRooms(),
    getSensorTypes(),
    getReadingsLatestDht(id).catch(() => null),
    getReadingsLatestStatus(id).catch(() => null),
    getDeviceTypes(),
  ]);

  const isOnline = latestStatus?.status ?? null;

  const availableSensors = allSensors?.filter(
    (as) => !deviceSensors?.some((ds) => ds.id === as.id),
  );

  return (
    <div className="space-y-6">
      {/* Titolo pagina */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{device.code}</h1>
          <p className="text-sm text-muted-foreground">
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

      {/* Griglia principale: letture a sinistra, dettagli a destra */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card letture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ultima lettura</CardTitle>
          </CardHeader>
          <CardContent>
            {latestDht ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {latestDht.temperature?.toFixed(1)}°C
                    </p>
                    <p className="text-xs text-muted-foreground">Temperatura</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Droplet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {latestDht.humidity?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Umidità</p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  {new Date(latestDht.timestamp).toLocaleDateString("it-IT", {
                    timeZone: "Europe/Rome",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nessuna lettura disponibile
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card dettagli device */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dettagli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Tipo:</span>
              <Link
                href={`/admin/device-types/${device.device_type.id}`}
                className="hover:underline"
              >
                <span className="font-medium">{device.device_type.code}</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Stanza:</span>
              {device.room ? (
                <Link
                  href={`/rooms/${device.room.id}`}
                  className="font-medium hover:underline"
                >
                  {device.room.name}
                </Link>
              ) : (
                <span className="font-medium">Nessuna stanza</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {device.id}
              </span>
            </div>
            <Separator />

            {/* Form modifica inline */}
            <EditDeviceForm
              device={device}
              deviceTypes={deviceTypes}
              rooms={rooms}
            />
            <Separator />
            <DeleteButton
              action={deleteDeviceAction.bind(null, id)}
              label="Elimina device"
            />
          </CardContent>
        </Card>
      </div>

      {/* Card sensori */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Sensori collegati ({deviceSensors?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Lista sensori */}
          {deviceSensors && deviceSensors.length > 0 ? (
            <div className="space-y-2">
              {deviceSensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <div className="justify-between">
                      <p className="text-sm font-medium">
                        <Link
                          href={`/admin/sensor-types/${sensor.id}`}
                          className="hover:underline"
                        >
                          {sensor.code}
                        </Link>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Radio className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Mqtt topic:
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{`${device.device_type.topic}/${device.code}/${sensor.topic}`}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sensor.description}
                    </p>
                  </div>
                  <DeleteButton
                    action={removeSensorAction.bind(null, id, sensor.id)}
                    label="Rimuovi"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nessun sensore collegato
            </p>
          )}

          {/* Form aggiunta sensore */}
          {availableSensors && availableSensors.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Aggiungi sensore</p>
                <AddSensorToDeviceForm
                  deviceId={device.id}
                  sensorsAvailable={availableSensors}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
