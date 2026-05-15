import { getDevice } from "@/services/device";
import { getRooms } from "@/services/room";
import { getDeviceSensors } from "@/services/sensors";
import { notFound } from "next/navigation";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function DevicesById({ params }: RouteParams) {
  const { id } = await params;

  // Fetch parallelo non in sequenza, le tre chiamate partono insieme
  // se mettevo le 3 chiamate singole le avrebbe eseguite in sequenza
  const [device, sensors, rooms] = await Promise.all([
    getDevice(id),
    getDeviceSensors(id),
    getRooms(),
  ]);

  if (!device) notFound();

  return (
    <main className=" p-20 ">
      <h1>Device: {device.code}</h1>
      <pre>{JSON.stringify(device, null, 2)}</pre>

      <h2>Sensori collegati {sensors.length}</h2>
      {sensors.map((sensor) => (
        <div key={sensor.id}>
          <pre>{JSON.stringify(sensor, null, 2)}</pre>
        </div>
      ))}

      <h3>Rooms disponibili</h3>
      {rooms.map((room) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </main>
  );
}
