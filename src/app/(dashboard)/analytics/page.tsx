"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useWorkouts } from "@/hooks/useWorkouts";
import { formatDate } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const { measurements } = useMeasurements();
  const { workoutLogs } = useWorkouts();

  const weightData = [...measurements]
    .slice(0, 30)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: m.weight || 0,
    }))
    .filter((d) => d.value > 0);

  const workoutFrequency = workoutLogs
    .slice(0, 30)
    .reduce((acc, log) => {
      const date = formatDate(log.date);
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const workoutData = Object.entries(workoutFrequency).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <DashboardLayout
      title="Análisis"
      description="Visualiza tu progreso y estadísticas"
    >
      <div className="space-y-6">
        {weightData.length > 0 ? (
          <>
            <ProgressChart
              data={weightData}
              title="Evolución del Peso"
              unit=" kg"
              color="#667eea"
            />
            {workoutData.length > 0 && (
              <ProgressChart
                data={workoutData}
                title="Frecuencia de Entrenamientos"
                unit=" sesiones"
                color="#f093fb"
              />
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay datos suficientes</h3>
              <p className="text-muted-foreground text-center">
                Registra mediciones y entrenamientos para ver tus análisis
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
