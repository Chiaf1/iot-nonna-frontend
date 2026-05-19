import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getDeviceType } from "@/services/device_type";
import { notFound } from "next/navigation";
import { deleteDeviceTypeAction } from "./actions";
import { EditDeviceTypeForm } from "@/components/device_type/EditDeviceTypeForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Radio, Tag } from "lucide-react";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function DeviceTypesById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const dt = await getDeviceType(id);

  if (!dt) notFound();

  return (
    <div className="space-y-6">
      {/* Titolo pagina */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{dt.code}</h1>
        </div>
      </div>

      {/* Griglia principale */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="text-base">
            <CardTitle>Dettagli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Radio className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Topic:</span>
              <span className="font-medium">{dt.topic}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {dt.id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">
                {dt.description}
              </span>
            </div>
            <DeleteButton
              action={deleteDeviceTypeAction.bind(null, id)}
              label="Elimina Device-type"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-base">
            <CardTitle>Modify device type</CardTitle>
          </CardHeader>
          <CardContent>
            <EditDeviceTypeForm deviceType={dt} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
