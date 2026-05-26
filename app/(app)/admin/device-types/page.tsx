import { DeviceTypeCard } from "@/components/device_type/DeviceTypeCard";
import { DeviceType } from "@/schemas/device_type.schema";
import { getDeviceTypes } from "@/services/device_type";
import { DevicetypePageClient } from "@/components/device_type/DevicetypePageClient";

export default async function DeviceTypes() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const deviceTypes = await getDeviceTypes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Device Types</h1>
        <DevicetypePageClient />
      </div>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {deviceTypes.map((dt: DeviceType) => (
          <DeviceTypeCard key={dt.id} deviceType={dt} />
        ))}
        {/* se non trova nessun dispositivo */}
        {deviceTypes.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </div>
  );
}
