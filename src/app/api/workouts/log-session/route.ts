import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, weekExercises } = body;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create ONE Parent Workout for this entire schedule
      const workout = await tx.workout.create({
        data: {
          userId: session.user.id,
          name: name || `Entrenamiento Semanal`,
          difficulty: "INTERMEDIATE",
        },
      });

      const logs = [];
      let globalOrder = 0;

      // 2. Iterate over the days and exercises
      if (weekExercises && Array.isArray(weekExercises)) {
        for (const day of weekExercises) {
          for (const ex of day.exercises) {
            
            // 2A. Create the WorkoutExercise relation (used to render the Details Page Grid)
            await tx.workoutExercise.create({
              data: {
                workoutId: workout.id,
                exerciseId: ex.exerciseId,
                order: globalOrder++,
                sets: ex.sets.length,
                reps: parseInt(ex.sets[0]?.reps) || 0,
                weight: parseFloat(ex.sets[0]?.weight) || 0,
                day: day.dayName // Store "Lunes", "Martes" here so the grid knows where to put it
              }
            });

            // 2B. Create the WorkoutLogs for actual progress tracking
            for (let i = 0; i < ex.sets.length; i++) {
              const set = ex.sets[i];
              const log = await tx.workoutLog.create({
                data: {
                  userId: session.user.id,
                  workoutId: workout.id,
                  exerciseId: ex.exerciseId,
                  date: new Date(day.dateStr + "T12:00:00Z"),
                  sets: i + 1, // Set number
                  reps: parseInt(set.reps) || 0,
                  weight: parseFloat(set.weight) || 0,
                },
              });
              logs.push(log);
            }
          }
        }
      }

      return { workout, logs };
    });

    // Purgar caché para que las páginas reflejen el nuevo entrenamiento instantáneamente
    revalidatePath("/workouts");

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create workout log session error:", error);
    return NextResponse.json(
      { error: "Error al guardar el entrenamiento" },
      { status: 500 }
    );
  }
}
