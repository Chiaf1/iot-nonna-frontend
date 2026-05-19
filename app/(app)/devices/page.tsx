import { getDevices } from "@/services/device";
import { Device } from "@/schemas/device.schema";
import Link from "next/link";
import { CreateDeviceForm } from "@/components/devices/CreateDeviceForm";
import { getRooms } from "@/services/room";
import { getDeviceTypes } from "@/services/device_type";
import { DeviceCard } from "@/components/dashboard/DeviceCard";
import {
  getReadingsLatestStatus,
  getReadingsLatestDht,
} from "@/services/readings";
import { Separator } from "@/components/ui/separator";
import { DeviceWithReading } from "@/types/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AutoRefresh } from "@/components/ui_personal/AutoRefresh";

export default async function Devices() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const [devices, deviceTypes, rooms] = await Promise.all([
    getDevices(),
    getDeviceTypes(),
    getRooms(),
  ]);

  const devicesWithReadings: DeviceWithReading[] = await Promise.all(
    devices.map(async (device) => {
      const [latestDht, latestStatus] = await Promise.all([
        getReadingsLatestDht(device.id).catch(() => null),
        getReadingsLatestStatus(device.id).catch(() => null),
      ]);
      return { device, latestDht, latestStatus };
    }),
  );

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={30} />
      <h1 className="text-2xl font-semibold">Devices</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {devicesWithReadings.map(({ device, latestDht, latestStatus }) => (
          <DeviceCard
            key={device.id}
            device={device}
            latestDht={latestDht}
            latestStatus={latestStatus}
          />
        ))}
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aggiungi decvice</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateDeviceForm deviceTypes={deviceTypes} rooms={rooms} />
        </CardContent>
      </Card>
    </div>
  );
}
