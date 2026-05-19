import { DeleteButton } from "@/components/ui_personal/DeleteButton";
import { getSensorType } from "@/services/sensor_type";
import { notFound } from "next/navigation";
import { deleteSensorTypeAction } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Radio, Tag, Table2, Database, Car } from "lucide-react";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export default async function SensorTypesById({ params }: RouteParams) {
  const { id } = await params;
  // 1. Raccatta i dati lato server non serve fare fetch
  const st = await getSensorType(id);

  if (!st) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{st.code}</h1>
          {st.description && (
            <p className="text-sm text-muted-foreground">{st.description}</p>
          )}
        </div>
        <Badge variant="outline">{st.payload_format}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dettagli base */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dettagli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Radio className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Topic:</span>
              <span className="font-mono text-xs">{st.topic}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Tabella:</span>
              <span className="font-mono text-xs">
                {st.readings_table_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Table2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">QoS MQTT:</span>
              <span className="font-medium">{st.qos_mqtt ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {st.id}
              </span>
            </div>
            <Separator />
            <DeleteButton
              action={deleteSensorTypeAction.bind(null, id)}
              label="Elimina Sensor-type"
            />
          </CardContent>
        </Card>

        {/* Column schema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Column schema</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(st.column_schema).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(st.column_schema).map(([key, col]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-mono font-medium">{key}</p>
                      <p className="text-sm text-muted-foreground">
                        colonna: {col.column}
                      </p>
                    </div>
                    <Badge variant="secondary">{col.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nessun campo definito
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
