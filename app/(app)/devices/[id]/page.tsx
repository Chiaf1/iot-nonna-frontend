import { getDevice } from "@/services/device";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function Dashboard({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const device = await getDevice(id);

  return (
    <main className=" p-20 ">
      <h1>Dashboard page</h1>
      <div>
        <h2>Devices:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {
          <div key={device.id}>
            <h3>Device ID: {device.id}</h3>
            <pre>{JSON.stringify(device, null, 2)}</pre>
          </div>
        }
        {/* se non trova nessun dispositivo */}
        {device === null && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
