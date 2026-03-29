"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/cards/StatCard";
import { WorkoutCard } from "@/components/cards/WorkoutCard";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useMeasurements } from "@/hooks/useMeasurements";
import { Weight, TrendingUp, Dumbbell, Flame, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  currentWeight: number | null;
  weightChange: number | null;
  bmi: number | null;
  bmiCategory: string | null;
  totalWorkouts: number;
  workoutsThisWeek: number;
  totalCalories: number;
  streak: number;
}

export default function DashboardPage() {
  const { workouts, isLoading: workoutsLoading } = useWorkouts();
  const { measurements, isLoading: measurementsLoading } = useMeasurements();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const recentWorkouts = workouts.slice(0, 3);
  
  const weightData = measurements
    .slice(0, 10)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: m.weight || 0,
    }));

  return (
    <DashboardLayout
      title="Dashboard"
      description="Resumen de tu progreso y actividad"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Peso Actual"
            value={stats?.currentWeight ? `${stats.currentWeight} kg` : "N/A"}
            icon={Weight}
            trend={
              stats?.weightChange
                ? {
                    value: Math.abs(stats.weightChange),
                    isPositive: stats.weightChange > 0,
                  }
                : undefined
            }
            color="purple"
          />
          <StatCard
            title="IMC"
            value={stats?.bmi ? stats.bmi.toFixed(1) : "N/A"}
            icon={TrendingUp}
            color="pink"
          />
          <StatCard
            title="Entrenamientos"
            value={stats?.totalWorkouts || 0}
            icon={Dumbbell}
            color="blue"
          />
          <StatCard
            title="Racha"
            value={`${stats?.streak || 0} días`}
            icon={Flame}
            color="orange"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weight Progress Chart */}
          <div>
            {weightData.length > 0 ? (
              <ProgressChart
                data={weightData}
                title="Progreso de Peso"
                unit=" kg"
                color="#667eea"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Progreso de Peso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <Weight className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No hay datos de peso registrados
                    </p>
                    <Link href="/measurements">
                      <Button className="mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Medición
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Actividad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Esta Semana</p>
                    <p className="text-xs text-muted-foreground">Entrenamientos</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.workoutsThisWeek || 0}</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Racha Actual</p>
                    <p className="text-xs text-muted-foreground">Días consecutivos</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.streak || 0}</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">IMC</p>
                    <p className="text-xs text-muted-foreground">{stats?.bmiCategory || "N/A"}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.bmi ? stats.bmi.toFixed(1) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entrenamientos Recientes</CardTitle>
            <Link href="/workouts">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes entrenamientos registrados
                </p>
                <Link href="/workouts">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Entrenamiento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
