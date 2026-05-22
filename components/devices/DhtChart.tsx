"use client";

import { useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { DhtReadings } from "@/schemas/readings.schema";
import { getDayBounds } from "@/lib/charts/dataRefinement";

type Props = {
  readings: DhtReadings[] | null;
  dayStart?: number; // timestamp in ms di inizio giornata
  dayEnd?: number; // timestamp in ms di fine giornata
};

const chartConfig = {
  temperature: {
    label: "Temperatura (°C)",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Umidità (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DhtChart({ readings, dayStart, dayEnd }: Props) {
  if (readings === null || readings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessuna lattura disponibile per oggi
      </p>
    );
  }
  // Set delle linee nascoste — inizialmente tutte visibili
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggleLine = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const start =
    dayStart ??
    (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })();
  const end =
    dayEnd ??
    (() => {
      const d = new Date();
      d.setHours(23, 59, 59, 999);
      return d.getTime();
    })();
  // Ogni punto ha il timestamp (ts) come numero che recharts userà per il posizionamento sull'asse x
  const data = readings
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .map((r) => ({
      ts: new Date(r.timestamp).getTime(),
      temperature: r.temperature ?? null,
      humidity: r.humidity ?? null,
    }));

  // Formatta i ticks dell'asse x da ms a HH:MM
  const formatTicks = (ms: number) =>
    new Date(ms).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Formatta il tooltip per mostrare HH:MM:SS
  const formatTooltipLabel = (ms: number) =>
    new Date(ms).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="ts"
          type="number" // fondamentale per mostrarei i dati posizionati correttamente
          domain={[start, end]} // iniziop e fine asse fissi
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={formatTicks}
          ticks={Array.from(
            { length: 9 },
            (_, i) => start + i * 3 * 60 * 60 * 1000,
          )}
        />
        <YAxis
          yAxisId="temp"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#aaa", fontSize: 11 }}
          width={25}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `${v}°`}
        />
        <YAxis
          yAxisId="hum"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#aaa", fontSize: 11 }}
          width={25}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;

            const ts = payload[0].payload.ts;
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm text-xs space-y-1">
                <p className="text-muted-foreground font-medium">
                  {new Date(Number(ts)).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
                {payload.map((entry) => (
                  <div
                    key={String(entry.dataKey)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="text-muted-foreground">
                      {
                        chartConfig[entry.dataKey as keyof typeof chartConfig]
                          ?.label
                      }
                      :
                    </span>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <ChartLegend
          content={() => (
            <div className="flex justify-center gap-4 mt-2">
              {Object.entries(chartConfig).map(([key, config]) => {
                const isHidden = hidden.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleLine(key)}
                    className="flex items-center gap-1.5 text-xs transition-opacity"
                    style={{ opacity: isHidden ? 0.35 : 1 }}
                  >
                    <div
                      className="h-2 w-4 rounded-full"
                      style={{ background: config.color }}
                    />
                    {config.label}
                  </button>
                );
              })}
            </div>
          )}
        />
        <Line
          yAxisId="hum"
          type="monotone"
          dataKey="humidity"
          stroke="var(--color-humidity)"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
          hide={hidden.has("humidity")}
        />
        <Line
          yAxisId="temp"
          type="monotone"
          dataKey="temperature"
          stroke="var(--color-temperature)"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
          hide={hidden.has("temperature")}
        />
      </LineChart>
    </ChartContainer>
  );
}
