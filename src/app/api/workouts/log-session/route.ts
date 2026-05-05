import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
      // 1. Create a placeholder Workout for this log session
      const workout = await tx.workout.create({
        data: {
          userId: session.user.id,
          name: name || `Entrenamiento - ${new Date(date).toLocaleDateString()}`,
          difficulty: "INTERMEDIATE",
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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create workout log session error:", error);
    return NextResponse.json(
      { error: "Error al guardar el entrenamiento" },
      { status: 500 }
    );
  }
}
