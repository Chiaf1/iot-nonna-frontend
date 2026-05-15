import { DeviceType } from "@/schemas/device_type.schema";
import { getDeviceTypes } from "@/services/device_type";

export default async function Dashboard() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const deviceTypes = await getDeviceTypes();

  return (
    <main className=" p-20 ">
      <h1>DeviceTypes page</h1>
      <div>
        <h2>DeviceTypes:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {deviceTypes.map((dt: DeviceType) => (
          <div key={dt.id}>
            <h3>Device Type ID: {dt.id}</h3>
            <pre>{JSON.stringify(dt, null, 2)}</pre>
          </div>
        ))}
        {/* se non trova nessun dispositivo */}
        {deviceTypes.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
