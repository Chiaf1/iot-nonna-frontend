"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

type Props = {
  deviceId: string;
  initialFrom?: string;
  initialTo?: string;
};

export function HistoryRangePicker({
  deviceId,
  initialFrom,
  initialTo,
}: Props) {
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>({
    from: initialFrom ? new Date(initialFrom) : undefined,
    to: initialTo ? new Date(initialTo) : undefined,
  });

  const handleApply = () => {
    if (!range?.from) return;
    const from = range.from.toISOString().split("T")[0];
    const to = (range.to ?? range.from).toISOString().split("T")[0];

    router.push(`/devices/${deviceId}/history?from=${from}&to=${to}`);
  };

  const formatDate = (d?: Date) =>
    d?.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {range?.from ? (
              range.to && range.to !== range.from ? (
                <span>
                  {formatDate(range.from)} - {formatDate(range.to)}
                </span>
              ) : (
                <span>{formatDate(range.from)}</span>
              )
            ) : (
              <span className="text-muted-foreground">
                Seleziona un periodo
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleApply} disabled={!range?.from}>
        Applica
      </Button>
    </div>
  );
}
