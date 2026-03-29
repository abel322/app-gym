"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useUser } from "@/hooks/useUser";
import { generateRecommendations, analyzeProgress } from "@/lib/algorithms/recommendations";
import { TrendingUp, Target, Award } from "lucide-react";

export default function ProgressPage() {
  const { measurements } = useMeasurements();
  const { user } = useUser();

  const recommendations = user?.weight && user?.height && user?.goal && user?.activityLevel
    ? generateRecommendations({
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        activityLevel: user.activityLevel,
        age: user.age || undefined,
        gender: user.gender || undefined,
      })
    : [];

  const progress = measurements.length >= 2 && user?.goal
    ? analyzeProgress(
        measurements.map((m) => ({ date: m.date, weight: m.weight || 0 })),
        user.goal
      )
    : null;

  return (
    <DashboardLayout
      title="Progreso"
      description="Analiza tu evolución y recibe recomendaciones"
    >
      <div className="space-y-6">
        {progress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análisis de Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tendencia</p>
                  <p className="text-2xl font-bold capitalize">{progress.trend}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cambio Semanal</p>
                  <p className="text-xl font-semibold">
                    {progress.weeklyChange > 0 ? "+" : ""}
                    {progress.weeklyChange.toFixed(2)} kg/semana
                  </p>
                </div>
                <p className="text-muted-foreground">{progress.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <Award className={`h-5 w-5 mt-0.5 ${
                        rec.priority === "high"
                          ? "text-red-500"
                          : rec.priority === "medium"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                        <span className="text-xs text-muted-foreground capitalize">
                          Prioridad: {rec.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Completa tu perfil para recibir recomendaciones personalizadas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
