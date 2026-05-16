import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getSensorType } from "@/services/sensor_type";
import { notFound } from "next/navigation";
import { deleteSensorTypeAction } from "./actions";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function SensorTypesById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const st = await getSensorType(id);

  if (!st) notFound();

  return (
    <main className=" p-20 ">
      <h1>Sensor-type page</h1>
      <div>
        <h2>Sensor-type:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        <div key={st.id}>
          <h3>Sensor-type ID: {st.id}</h3>
          <pre>{JSON.stringify(st)}</pre>
        </div>
        <DeleteButton
          action={deleteSensorTypeAction.bind(null, id)}
          label="Elimina Sensor-type"
        />
      </div>
    </main>
  );
}
