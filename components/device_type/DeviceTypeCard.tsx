import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { DeviceType } from "@/schemas/device_type.schema";
import { Radio } from "lucide-react";

type Props = {
  deviceType: DeviceType;
};

export function DeviceTypeCard({ deviceType }: Props) {
  return (
    <Card>
      <CardContent>
        <div>
          <Link
            href={`/admin/device-types/${deviceType.id}`}
            className="grid grid-cols-1 gap-1"
          >
            <p className="font-medium text-sm hover:underline">
              {deviceType.code}
            </p>
            <div className="text-xs flex flex-row items-center gap-1">
              <Radio className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Topic:</span>
              <span className="text-muted-foreground font-mono">
                {deviceType.topic}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {deviceType.description ?? (
                <p className="text-xs text-muted-foreground">
                  {deviceType.description}
                </p>
              )}
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
