import { SensorType } from "@/schemas/sensor_type.schema";
import { getSensorTypes } from "@/services/sensor_type";
import Link from "next/link";

export default async function SensorTypes() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const sensorTypes = await getSensorTypes();

  return (
    <main className=" p-20 ">
      <h1>SensorTypes page</h1>
      <div>
        <h2>SensorTypes:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        {sensorTypes.map((st: SensorType) => (
          <div key={st.id}>
            <Link
              className="hover:text-blue-500"
              href={`/admin/sensor-types/${st.id}`}
            >
              Sensor-type ID: {st.id}
            </Link>
            <pre>{JSON.stringify(st, null, 2)}</pre>
          </div>
        ))}
        {/* se non trova nessun dispositivo */}
        {sensorTypes.length === 0 && <p>Nessun dispositivo trovato</p>}
      </div>
    </main>
  );
}
