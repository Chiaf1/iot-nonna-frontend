import { getDevices } from "@/services/device";
import {
  getReadingsLatestDht,
  getReadingsLatestStatus,
} from "@/services/readings";
import Link from "next/link";
import { DeviceWithReading } from "@/types/dashboard";
import { RoomCard } from "@/components/dashboard/RoomCard";

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
      const [latestDht, latestStatus] = await Promise.all([
        getReadingsLatestDht(device.id).catch(() => null),
        getReadingsLatestStatus(device.id).catch(() => null),
      ]);
      return { device, latestDht, latestStatus };
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="space-y-4">
        {roomGroups.map((group) => (
          <RoomCard
            key={group.roomId}
            roomName={group.roomName}
            devices={group.devices}
          />
        ))}
      </div>
    </div>
  );
}
