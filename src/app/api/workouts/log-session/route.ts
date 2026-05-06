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
    const { name, date, exercises } = body;

    // exercises is an array of { exerciseId, sets: { reps, weight }[] }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create a placeholder Workout for this log session with its exercises
      const workout = await tx.workout.create({
        data: {
          userId: session.user.id,
          name: name || `Entrenamiento - ${new Date(date).toLocaleDateString()}`,
          difficulty: "INTERMEDIATE",
          exercises: {
            create: exercises.map((ex: any, idx: number) => ({
              exerciseId: ex.exerciseId,
              order: idx,
              sets: ex.sets.length,
              reps: parseInt(ex.sets[0]?.reps) || 0,
              weight: parseFloat(ex.sets[0]?.weight) || 0,
            })),
          },
        },
      });

      // 2. Create the WorkoutLogs
      const logs = [];
      for (const ex of exercises) {
        for (let i = 0; i < ex.sets.length; i++) {
          const set = ex.sets[i];
          const log = await tx.workoutLog.create({
            data: {
              userId: session.user.id,
              workoutId: workout.id,
              exerciseId: ex.exerciseId,
              date: new Date(date),
              sets: i + 1, // Set number
              reps: parseInt(set.reps) || 0,
              weight: parseFloat(set.weight) || 0,
            },
          });
          logs.push(log);
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
