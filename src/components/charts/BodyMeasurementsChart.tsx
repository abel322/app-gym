"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressChart } from "./ProgressChart";
import { BodyMeasurement } from "@/types";
import { formatDate } from "@/lib/utils";

interface BodyMeasurementsChartProps {
  measurements: BodyMeasurement[];
}

export function BodyMeasurementsChart({ measurements }: BodyMeasurementsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("weight");

  const metrics = [
    { value: "weight", label: "Peso", unit: " kg" },
    { value: "bodyFat", label: "Grasa Corporal", unit: "%" },
    { value: "chest", label: "Pecho", unit: " cm" },
    { value: "waist", label: "Cintura", unit: " cm" },
    { value: "hips", label: "Cadera", unit: " cm" },
    { value: "biceps", label: "Bíceps", unit: " cm" },
    { value: "thighs", label: "Muslos", unit: " cm" },
    { value: "calves", label: "Pantorrillas", unit: " cm" },
    { value: "neck", label: "Cuello", unit: " cm" },
    { value: "shoulders", label: "Hombros", unit: " cm" },
    { value: "muscleMass", label: "Masa Muscular", unit: " kg" },
  ];

  const selectedMetricData = metrics.find((m) => m.value === selectedMetric);

  const chartData = [...measurements]
    .filter((m) => m[selectedMetric as keyof BodyMeasurement] != null)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: (m[selectedMetric as keyof BodyMeasurement] as number) || 0,
    }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evolución de Medidas</CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ProgressChart
            data={chartData}
            title=""
            unit={selectedMetricData?.unit || ""}
            color="#667eea"
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos para esta métrica
          </div>
        )}
      </CardContent>
    </Card>
  );
}
