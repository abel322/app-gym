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

    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error("Error al parsear el JSON de la solicitud:", parseErr);
      return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
    }

    const { name, weekExercises } = body;

    // Robust validation
    if (!name) {
      return NextResponse.json({ error: "Faltan datos requeridos: name (nombre de la rutina)" }, { status: 400 });
    }

    if (!weekExercises || !Array.isArray(weekExercises) || weekExercises.length === 0) {
      return NextResponse.json({ error: "Faltan datos requeridos: weekExercises" }, { status: 400 });
    }

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
      for (const day of weekExercises) {
        if (!day.dayName || !day.exercises || !Array.isArray(day.exercises)) {
          throw new Error("Estructura de día de entrenamiento inválida o faltante.");
        }

        // Standardized date format parsing
        let dateObj;
        try {
          dateObj = new Date(day.dateStr + "T12:00:00Z");
          if (isNaN(dateObj.getTime())) {
            dateObj = new Date();
          }
        } catch (e) {
          dateObj = new Date();
        }

        for (const ex of day.exercises) {
          if (!ex.exerciseId) {
            throw new Error("Falta el identificador del ejercicio (exerciseId).");
          }

          // Ensure the exercise exists in the database before referencing it
          let exerciseId = ex.exerciseId;
          const exerciseExists = await tx.exercise.findUnique({
            where: { id: exerciseId }
          });

          if (!exerciseExists) {
            // Try to find it by name to prevent duplicates
            const existingByName = await tx.exercise.findFirst({
              where: { name: { equals: ex.exerciseName, mode: 'insensitive' } }
            });

            if (existingByName) {
              exerciseId = existingByName.id;
            } else {
              // Create it
              const fallbackImage = `https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80`;
              const newEx = await tx.exercise.create({
                data: {
                  id: exerciseId.startsWith('default-') ? `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` : exerciseId,
                  name: ex.exerciseName || "Ejercicio",
                  muscleGroup: ex.muscleGroup || "cuerpo completo",
                  imageUrl: ex.imageUrl || fallbackImage,
                  description: ex.description || `Ejercicio para ${ex.muscleGroup || "cuerpo completo"}.`,
                }
              });
              exerciseId = newEx.id;
            }
          }

          // 2A. Create the WorkoutExercise relation (used to render the Details Page Grid)
          const exerciseSetsCount = ex.sets?.length || 1;
          const firstSetReps = parseInt(ex.sets?.[0]?.reps) || 0;
          const firstSetWeight = parseFloat(ex.sets?.[0]?.weight) || 0;

          await tx.workoutExercise.create({
            data: {
              workoutId: workout.id,
              exerciseId: exerciseId,
              order: globalOrder++,
              sets: exerciseSetsCount,
              reps: firstSetReps,
              weight: firstSetWeight,
              day: day.dayName
            }
          });

          // 2B. Create the WorkoutLogs for actual progress tracking
          if (ex.sets && Array.isArray(ex.sets)) {
            for (let i = 0; i < ex.sets.length; i++) {
              const set = ex.sets[i];
              const log = await tx.workoutLog.create({
                data: {
                  userId: session.user.id,
                  workoutId: workout.id,
                  exerciseId: exerciseId,
                  date: dateObj,
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
  } catch (error: any) {
    console.error("Create workout log session error (critical db rollback):", error);
    if (error.code) {
      console.error(`Código de error Prisma: ${error.code}`);
    }
    if (error.meta) {
      console.error("Meta de error Prisma:", JSON.stringify(error.meta, null, 2));
    }
    return NextResponse.json(
      { 
        error: "Error interno de base de datos al guardar el cronograma", 
        details: error.message || String(error) 
      },
      { status: 500 }
    );
  }
}
