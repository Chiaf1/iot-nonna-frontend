import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getDeviceType } from "@/services/device_type";
import { notFound } from "next/navigation";
import { deleteDeviceTypeAction } from "./actions";
import { EditDeviceTypeForm } from "@/components/device_type/EditDeviceTypeForm";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function DeviceTypesById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const dt = await getDeviceType(id);

  if (!dt) notFound();

  return (
    <main className=" p-20 ">
      <h1>Device-type page</h1>
      <div>
        <h2>Device-type:</h2>
        {/* 2. Cicliamo l'array e printiamo ogni dispositivo */}
        <div key={dt.id}>
          <h3>Device-type ID: {dt.id}</h3>
          <pre>{JSON.stringify(dt, null, 2)}</pre>
        </div>
        <DeleteButton
          action={deleteDeviceTypeAction.bind(null, id)}
          label="Elimina Device-type"
        />
      </div>
      <h2>Modifica Device Type</h2>
      <EditDeviceTypeForm deviceType={dt} />
    </main>
  );
}
