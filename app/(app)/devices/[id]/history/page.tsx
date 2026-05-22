import { DhtChart } from "@/components/devices/DhtChart";
import { HistoryRangePicker } from "@/components/devices/HistoryRangePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DhtReadings } from "@/schemas/readings.schema";
import { getDevice } from "@/services/device";
import { getReadingsRangeDht } from "@/services/readings";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

function groupByDay(readings: DhtReadings[]): Record<string, DhtReadings[]> {
  return readings.reduce<Record<string, DhtReadings[]>>((acc, r) => {
    const key = new Date(r.timestamp).toLocaleDateString("sv-SE"); // a quanto pare sv-SE formatta YYYY-MM-DD
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
}

export default async function DeviceHistory({ params, searchParams }: Props) {
  const { id } = await params;
  const { from, to } = await searchParams;

  const device = await getDevice(id).catch(() => null);
  if (!device) notFound();

  // Default: ultima settimana
  const toDate = to ? new Date(to) : new Date();
  const fromDate = from
    ? new Date(from)
    : new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  toDate.setHours(23, 59, 59, 999);
  fromDate.setHours(0, 0, 0, 0);

  const readings = await getReadingsRangeDht(id, {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    limit: "10000",
  }).catch(() => []);

  // Raggruppa per giorno  e ordina dal più recente
  const grouped = groupByDay(readings ?? []);
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* Header con backlink */}
      <div>
        <Link
          href={`/devices/${id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {device.code}
        </Link>
        <h1 className="text-2xl font-semibold">Storico letture</h1>
      </div>

      {/* Range Picker */}
      <HistoryRangePicker deviceId={id} initialFrom={from} initialTo={to} />

      {days.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nessuna lettura nel periodo selezionato
        </p>
      )}
      <div className="space-y-4">
        {days.map((day) => {
          const [y, m, d] = day.split("-").map(Number);
          const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
          const dayEnd = new Date(y, m - 1, d, 23, 59, 59, 999);

          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-base">
                  {dayStart.toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    ({grouped[day].length} letture)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DhtChart
                  readings={grouped[day]}
                  dayStart={dayStart.getTime()}
                  dayEnd={dayEnd.getTime()}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Grafico */}
    </div>
  );
}
