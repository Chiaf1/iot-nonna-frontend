"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { DhtReadings } from "@/schemas/readings.schema";

type Props = {
  readings: DhtReadings[] | null;
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

export function DhtChart({ readings }: Props) {
  if (readings === null || readings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessuna lattura disponibile per oggi
      </p>
    );
  }

  // Trasforma i dati per recharts che vuole un array di oggetti piatti
  const data = readings
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .map((r) => ({
      // ora nel formato HH:MM Per l'asse x
      time: new Date(r.timestamp).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      temperature: r.temperature ?? null,
      humidity: r.humidity ?? null,
    }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          // Mostra solo alcuni tick per non affollare l'asse
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="temp"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#aaa", fontSize: 11 }}
          width={25}
          domain={["auto", "auto"]}
          orientation="right"
          tickFormatter={(v) => `${v}°`}
        />
        <YAxis
          yAxisId="hum"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#aaa", fontSize: 11 }}
          width={25}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="hum"
          type="monotone"
          dataKey="humidity"
          stroke="var(--color-humidity)"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
        />
        <Line
          yAxisId="temp"
          type="monotone"
          dataKey="temperature"
          stroke="var(--color-temperature)"
          strokeWidth={1.5}
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
