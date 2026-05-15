import { getDevices } from "@/services/device";
import { Device } from "@/schemas/device.schema";
import Link from "next/link";

export default async function Devices() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const devices = await getDevices();

  return (
    <main className=" p-20 ">
      <h1>Device page</h1>
      <div>
        <h2>Devices:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {devices.map((device: Device) => (
          <div key={device.id}>
            <Link
              className="hover:text-blue-500"
              href={`/devices/${device.id}`}
            >
              Device ID: {device.id}
            </Link>
            <pre>{JSON.stringify(device, null, 2)}</pre>
          </div>
        ))}
        {/* se non trova nessun dispositivo */}
        {devices.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
