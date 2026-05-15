import { getDevices } from "@/services/device";
import { Device } from "@/schemas/device.schema";

// Per visualizzare i dati nella pagina dahsboard bisogna raggruppare i device per stanza
// quindi per farlo bisogna crare una struttura che renda questo lavoro più chiaro
type RoomGroup = {
  room: { id: string; name: string } | null;
  devices: Device[];
};

export default async function Dashboard() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const devices = await getDevices();

  // Per raggruppare i device in rooms usando reduce
  // reduce riduce un array ad un singolo valore nel nostro caso l'oggeto RoomGroup
  // reduce accumula i vari dati nell'accumulatore (acc) che aprte dal valore dichiarato nella parentesi
  // nel nostro caso {} e ad ogni eterazione lo modifica e ritorna
  const grouped = devices.reduce<Record<string, RoomGroup>>((acc, device) => {
    // Recuperiamo la chiave dall'id della room se non esite unassigned
    const key = device.room?.id ?? "unassigned";

    if (!acc[key]) {
      // prima volta che vediamo questa room: la inizializziamo
      acc[key] = {
        room: device.room ?? null,
        devices: [],
      };
    }

    // Aggiungiamo il device alla room
    acc[key].devices.push(device);
    return acc;
  }, {});

  // convertiamo in array per renderizzare più in fretta
  const roomGroups = Object.values(grouped);

  return (
    <div>
      <h1>Dashboard</h1>
      {roomGroups.map((group) => (
        <div key={group.room?.id ?? "unassigned"}>
          <h2>{group.room?.name ?? "Senza stanza"}</h2>
          {group.devices.map((device) => (
            <div key={device.id}>
              <p>
                {device.code} - {device.device_type.code}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
