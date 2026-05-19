import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorType } from "@/schemas/sensor_type.schema";
import Link from "next/link";
import { Radio } from "lucide-react";

type Props = {
  sensor: SensorType;
};

export function SensorTypeCard({ sensor }: Props) {
  return (
    <Card>
      <CardContent>
        <div>
          <Link
            href={`/admin/sensor-types/${sensor.id}`}
            className="grid grid-cols-1 gap-1"
          >
            <h2 className="font-medium text-sm hover:underline">
              {sensor.code}
            </h2>
            <div className="text-xs flex flex-row items-center gap-1">
              <Radio className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Topic:</span>
              <span className="text-muted-foreground font-mono">
                {sensor.topic}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {sensor.description ?? (
                <p className="text-xs text-muted-foreground">
                  {sensor.description}
                </p>
              )}
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
