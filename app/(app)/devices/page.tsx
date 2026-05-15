import { getDevices } from "@/services/device";
import { Device } from "@/schemas/device.schema";

export default async function Dashboard() {
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
            <h3>Device ID: {device.id}</h3>
            <pre>{JSON.stringify(device, null, 2)}</pre>
          </div>
        ))}
        {/* se non trova nessun dispositivo */}
        {devices.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
