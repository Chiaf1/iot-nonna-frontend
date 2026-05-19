import { SensorTypeCard } from "@/components/sensor_type/SensorTypeCard";
import { SensorType } from "@/schemas/sensor_type.schema";
import { getSensorTypes } from "@/services/sensor_type";
import Link from "next/link";

export default async function SensorTypes() {
  // 1. Raccatta i dati lato server non serve fare fetch
  const sensorTypes = await getSensorTypes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sensor Types</h1>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sensorTypes && sensorTypes.length > 0 ? (
          sensorTypes.map((st: SensorType) => (
            <SensorTypeCard key={st.id} sensor={st} />
          ))
        ) : (
          <p>Nessun sensor type trovato</p>
        )}
      </div>
    </div>
  );
}
