import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function WorkoutDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const workout = await prisma.workout.findUnique({
    where: { 
      id: params.id,
      userId: session.user.id // ensure user owns it
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!workout) {
    notFound();
  }

  return (
    <DashboardLayout
      title="Detalles del Entrenamiento"
      description="Visualiza la información completa de tu rutina."
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              {workout.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-gray-500 dark:text-slate-400">
              {workout.description || "Sin descripción proporcionada."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 bg-gray-50 dark:bg-zinc-800">
              {workout.difficulty}
            </Badge>
            {workout.duration && (
              <Badge variant="outline" className="px-3 py-1 flex items-center gap-1 bg-gray-50 dark:bg-zinc-800">
                <Clock className="w-3.5 h-3.5" />
                {workout.duration} min
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-slate-200">
            <Dumbbell className="w-5 h-5 text-primary" />
            Ejercicios ({workout.exercises.length})
          </h2>

          <div className="grid gap-4">
            {workout.exercises.map((we, index) => (
              <Card key={we.id} className="dark:bg-zinc-900 dark:border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <span className="text-primary mr-2">{index + 1}.</span>
                      {we.exercise.name}
                    </CardTitle>
                    <Badge variant="secondary">{we.exercise.muscleGroup}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground flex gap-4">
                    <span><strong>Series:</strong> {we.sets}</span>
                    <span><strong>Reps:</strong> {we.reps}</span>
                    <span><strong>Descanso:</strong> {we.restSeconds}s</span>
                    {we.weight && <span><strong>Peso:</strong> {we.weight}kg</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {workout.exercises.length === 0 && (
              <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-muted-foreground italic">Este entrenamiento no tiene ejercicios aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
