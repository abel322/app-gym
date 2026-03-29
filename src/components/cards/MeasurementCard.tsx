"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { BodyMeasurement } from "@/types";
import { Ruler, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MeasurementCardProps {
  measurement: BodyMeasurement;
  previousMeasurement?: BodyMeasurement;
  className?: string;
}

export function MeasurementCard({
  measurement,
  previousMeasurement,
  className,
}: MeasurementCardProps) {
  const getTrend = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return null;
    const diff = current - previous;
    if (diff > 0) return { value: diff, direction: "up" as const };
    if (diff < 0) return { value: Math.abs(diff), direction: "down" as const };
    return { value: 0, direction: "stable" as const };
  };

  const TrendIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Medición
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {formatDate(measurement.date)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <MeasurementItem
              label="Peso"
              value={measurement.weight}
              unit="kg"
              trend={
                previousMeasurement
                  ? getTrend(measurement.weight, previousMeasurement.weight)
                  : undefined
              }
            />

            {/* Body Fat */}
            <MeasurementItem
              label="Grasa Corporal"
              value={measurement.bodyFat}
              unit="%"
              trend={
                previousMeasurement
                  ? getTrend(measurement.bodyFat, previousMeasurement.bodyFat)
                  : undefined
              }
            />

            {/* Muscle Mass */}
            <MeasurementItem
              label="Masa Muscular"
              value={measurement.muscleMass}
              unit="kg"
              trend={
                previousMeasurement
                  ? getTrend(measurement.muscleMass, previousMeasurement.muscleMass)
                  : undefined
              }
            />

            {/* Waist */}
            <MeasurementItem
              label="Cintura"
              value={measurement.waist}
              unit="cm"
              trend={
                previousMeasurement
                  ? getTrend(measurement.waist, previousMeasurement.waist)
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MeasurementItemProps {
  label: string;
  value: number | null;
  unit: string;
  trend?: { value: number; direction: "up" | "down" | "stable" } | undefined;
}

function MeasurementItem({ label, value, unit, trend }: MeasurementItemProps) {
  return (
    <div className="bg-muted/30 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {trend && trend.direction !== "stable" && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {trend.direction === "up" ? "+" : "-"}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-xl font-bold mt-1">
        {value !== null ? value : "--"}
        <span className="text-sm font-normal text-muted-foreground ml-1">
          {unit}
        </span>
      </p>
    </div>
  );
}