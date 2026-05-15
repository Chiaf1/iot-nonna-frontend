import { getDevices } from "@/services/device";
import { Device } from "@/schemas/device.schema";
import { DhtReadings } from "@/schemas/readings.schema";
import { getReadingsLatestDht } from "@/services/readings";
import Link from "next/link";

// Siccoem voglio mostrare le ultime letture di temperatura devo creare una struttura
// che assci il device con l'ultimo valore letto
type DeviceWithReading = {
  device: Device;
  latestDht: DhtReadings | null;
};

// Per visualizzare i dati nella pagina dahsboard bisogna raggruppare i device per stanza
// quindi per farlo bisogna crare una struttura che renda questo lavoro più chiaro
type RoomGroup = {
  roomId: string;
  roomName: string | null;
  devices: DeviceWithReading[];
};

export default async function Dashboard() {
  // 1. prendo tutti i device
  const devices = await getDevices();

  // 2. per ogni device prendo l'ultima lettura - per farlo non possso fare n letture per n device
  // bisogna raggrupparle in un unica promise in modo da lanciarle tutte in parallelo
  // il .catch(() => null) é fondamentale altrimenti tutta la pagina crasherebbe al primo errore
  const devicesWithReadings: DeviceWithReading[] = await Promise.all(
    devices.map(async (device) => {
      const latestDht = await getReadingsLatestDht(device.id).catch(() => null);
      return { device, latestDht };
    }),
  );

  // 3. raggruppo tutto per rooms
  // Per raggruppare i device in rooms usando reduce
  // reduce riduce un array ad un singolo valore nel nostro caso l'oggeto RoomGroup
  // reduce accumula i vari dati nell'accumulatore (acc) che aprte dal valore dichiarato nella parentesi
  // nel nostro caso {} e ad ogni eterazione lo modifica e ritorna
  const groupMap = devicesWithReadings.reduce<Record<string, RoomGroup>>(
    (acc, item) => {
      // Recuperiamo la chiave dall'id della room se non esite unassigned
      const key = item.device.room?.id ?? "unassigned";

      if (!acc[key]) {
        // prima volta che vediamo questa room: la inizializziamo
        acc[key] = {
          roomId: key,
          roomName: item.device.room?.name ?? null,
          devices: [],
        };
      }

      // Aggiungiamo il device alla room
      acc[key].devices.push(item);
      return acc;
    },
    {},
  );

  // 4. converti in array tenedo "unassigned" per ultimo
  const roomGroups = Object.values(groupMap).sort((a, b) => {
    if (a.roomId === "unassigned") return 1;
    if (b.roomId === "unassigned") return -1;
    return (a.roomName ?? "").localeCompare(b.roomName ?? "");
  });

  return (
    <div>
      <h1>Dashboard</h1>

      {roomGroups.map((group) => (
        <div key={group.roomId}>
          <h2>{group.roomName ?? "Senza stanza"}</h2>
          <div>
            {group.devices.map(({ device, latestDht }) => (
              <Link key={device.id} href={`/devices/${device.id}`}>
                <div>
                  <p>{device.code}</p>
                  <p>{device.device_type.code}</p>

                  {latestDht ? (
                    <div>
                      <span>🌡 {latestDht.temperature?.toFixed(1)}°C</span>
                      <span>💧 {latestDht.humidity?.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <p>Nessuna lettura</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
