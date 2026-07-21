"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useUser";
import { useMeasurements } from "@/hooks/useMeasurements";
import { Weight, TrendingUp, Dumbbell, Flame, Target, Calculator as CalcIcon } from "lucide-react";
import Link from "next/link";
import { CalorieCalculator } from "@/components/dashboard/CalorieCalculator";
import { ExerciseRecommendations } from "@/components/dashboard/ExerciseRecommendations";
import { WeeklyProgressTracker } from "@/components/dashboard/WeeklyProgressTracker";
import { ProgressChart } from "@/components/charts/ProgressChart";
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
  const { user } = useUser();
  const { measurements } = useMeasurements();
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

  const weightData = [...measurements]
    .slice(0, 10)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: m.weight || 0,
    }));

  const waistData = [...measurements]
    .slice(0, 10)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: m.waist || 0,
    }));

  const chestData = [...measurements]
    .slice(0, 10)
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      value: m.chest || 0,
    }));

  return (
    <DashboardLayout
      title="Dashboard de Superávit"
      description="Panel de control para ganar masa muscular"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Resumen</TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm py-2">Calculadora</TabsTrigger>
            <TabsTrigger value="exercises" className="text-xs sm:text-sm py-2">Ejercicios</TabsTrigger>
            <TabsTrigger value="tracking" className="text-xs sm:text-sm py-2">Seguimiento</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {weightData.length > 0 && (
                <ProgressChart
                  data={weightData}
                  title="Progreso de Peso"
                  unit=" kg"
                  color="#667eea"
                />
              )}
              {chestData.length > 0 && (
                <ProgressChart
                  data={chestData}
                  title="Circunferencia de Pecho"
                  unit=" cm"
                  color="#f093fb"
                />
              )}
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Resumen de Actividad</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">Esta Semana</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground truncate">Entrenamientos</p>
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold ml-2">{stats?.workoutsThisWeek || 0}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">Racha Actual</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground truncate">Días consecutivos</p>
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold ml-2">{stats?.streak || 0}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">Objetivo</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                          {user?.goal === "GAIN_MUSCLE" ? "Ganar Músculo" : "Mantener"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold ml-2">
                      {stats?.bmi ? stats.bmi.toFixed(1) : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t">
                  <Link href="/measurements">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <Weight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Agregar Medición
                    </Button>
                  </Link>
                  <Link href="/workouts">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <Dumbbell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Registrar Entrenamiento
                    </Button>
                  </Link>
                  <Link href="/nutrition">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                      <CalcIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Ver Nutrición
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <CalorieCalculator />
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <ExerciseRecommendations 
              gender={user?.gender} 
              goal={user?.goal}
            />
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking">
            <WeeklyProgressTracker />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
