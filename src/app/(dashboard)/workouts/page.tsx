"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkoutCard } from "@/components/cards/WorkoutCard";
import { Button } from "@/components/ui/button";
import { useWorkouts } from "@/hooks/useWorkouts";
import { Plus, Dumbbell } from "lucide-react";
import Link from "next/link";

export default function WorkoutsPage() {
  const { workouts, isLoading } = useWorkouts();

  return (
    <DashboardLayout
      title="Entrenamientos"
      description="Gestiona tus rutinas de ejercicio"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link href="/workouts/new">
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Entrenamiento
            </Button>
          </Link>
        </div>

        {workouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay entrenamientos</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer entrenamiento para comenzar
            </p>
            <Link href="/workouts/new">
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Crear Entrenamiento
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
