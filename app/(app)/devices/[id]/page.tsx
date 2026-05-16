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
  const [sensors, rooms, sensorTypes, latestDht, latestStatus] =
    await Promise.all([
      getDeviceSensors(id).catch(() => null),
      getRooms(),
      getSensorTypes(),
      getReadingsLatestDht(id).catch(() => null),
      getReadingsLatestStatus(id).catch(() => null),
    ]);

  return (
    <main className=" p-20 ">
      {/* Stato online / offline */}
      <div>
        <span>Stato: </span>
        {latestStatus ? (
          <span>{latestStatus.status ? "Online" : "Offline"}</span>
        ) : (
          <span>Sconosciuto</span>
        )}
      </div>

      {/* Dati device */}
      <h1>Device: {device.code}</h1>
      <p>Tipo: {device.device_type.code}</p>
      <p>Stanza: {device.room?.name ?? "Nessuna stanza"}</p>
      <pre>{JSON.stringify(device, null, 2)}</pre>
      {/* Elimina device */}
      <DeleteButton
        action={deleteDeviceAction.bind(null, id)}
        label="Elimina Device"
      />
      {/* Ultima lettura DHT */}
      <h2>Dati ultima lettura</h2>
      {latestDht ? (
        <div>
          <p>Temperatura: {latestDht.temperature?.toFixed(1)}°C</p>
          <p>Umidità: {latestDht.humidity?.toFixed(1)}%</p>
          <p>Timestamp: {latestDht.timestamp}</p>
        </div>
      ) : (
        <p>Nessuna lettura disponibile</p>
      )}

      {/* Sensori collegati */}
      <h2>Sensori collegati</h2>
      {sensors?.map((sensor) => (
        <div key={sensor.id}>
          <p>
            {sensor.code} - {sensor.description}
          </p>
          <DeleteButton
            action={removeSensorAction.bind(null, id, sensor.id)}
            label="Rimuovi Sensore"
          />
        </div>
      )) ?? <p>Nessun sensore collegato</p>}

      {/* Sensor types disponibili */}
      <h2>Sensor types disponibili {sensorTypes.length}</h2>
      {sensorTypes.map((st) => (
        <div key={st.id}>
          <p>{st.code}</p>
        </div>
      ))}

      {/* Rooms disponibili  */}
      <h2>Rooms disponibili</h2>
      {rooms.map((room) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </main>
  );
}
