import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { DeviceType } from "@/schemas/device_type.schema";

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
              <p className="text-muted-foreground">Topic:</p>
              <p className="text-muted-foreground font-mono">
                {deviceType.topic}
              </p>
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
