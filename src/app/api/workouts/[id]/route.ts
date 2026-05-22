import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { workoutSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: "Entrenamiento no encontrado" },
        { status: 404 }
      );
    }

    if (workout.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Get workout error:", error);
    return NextResponse.json(
      { error: "Error al obtener entrenamiento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { name, description, difficulty, duration, weekExercises } = body;
    
    // Log target and payload for debugging
    console.log(`[PUT] Actualizando entrenamiento ID: ${params.id} para usuario: ${session.user.id}`);
    console.log("Cuerpo recibido:", JSON.stringify({ name, description, difficulty, duration, weekExercisesCount: weekExercises?.length }, null, 2));

    // Validar datos con Zod de manera robusta
    let validatedData;
    try {
      validatedData = workoutSchema.parse({ name, description, difficulty, duration });
    } catch (validationError: any) {
      console.error("Error de validación en PUT workout:", validationError);
      return NextResponse.json(
        { 
          error: "Datos de entrada inválidos", 
          details: validationError.errors || validationError.message 
        }, 
        { status: 400 }
      );
    }

    // Verificar la existencia y pertenencia del entrenamiento
    let existingWorkout;
    try {
      existingWorkout = await prisma.workout.findUnique({
        where: { id: params.id },
      });
    } catch (dbError) {
      console.error("Error al buscar el entrenamiento en la base de datos:", dbError);
      return NextResponse.json({ error: "Error en la base de datos al buscar el entrenamiento" }, { status: 500 });
    }

    if (!existingWorkout) {
      return NextResponse.json(
        { error: "Entrenamiento no encontrado" },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    // Ejecutar la actualización en una transacción
    let workout;
    try {
      workout = await prisma.$transaction(async (tx) => {
        // 1. Actualizar datos principales del entrenamiento
        const updatedWorkout = await tx.workout.update({
          where: { id: params.id },
          data: validatedData,
        });

        // 2. Si se suministran ejercicios de la semana, actualizar la relación
        if (weekExercises && Array.isArray(weekExercises)) {
          // A. Eliminar ejercicios previos
          await tx.workoutExercise.deleteMany({
            where: { workoutId: params.id },
          });

          // B. Insertar los nuevos ejercicios mapeados
          let globalOrder = 0;
          for (const day of weekExercises) {
            for (const ex of day.exercises) {
              await tx.workoutExercise.create({
                data: {
                  workoutId: params.id,
                  exerciseId: ex.exerciseId,
                  order: globalOrder++,
                  sets: ex.sets.length,
                  reps: parseInt(ex.sets[0]?.reps) || 0,
                  weight: parseFloat(ex.sets[0]?.weight) || 0,
                  day: day.dayName
                }
              });
            }
          }
        }

        return updatedWorkout;
      });
    } catch (transactionError: any) {
      console.error("Error crítico en la transacción de actualización de base de datos:", transactionError);
      
      // Registrar información específica de Prisma
      if (transactionError.code) {
        console.error(`Código de error Prisma: ${transactionError.code}`);
      }
      if (transactionError.meta) {
        console.error("Meta de error Prisma:", JSON.stringify(transactionError.meta, null, 2));
      }

      return NextResponse.json(
        { 
          error: "Error interno de base de datos al actualizar el cronograma", 
          details: transactionError.message || String(transactionError) 
        }, 
        { status: 500 }
      );
    }

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/workouts");
      revalidatePath(`/workouts/${params.id}`);
    } catch (cacheErr) {
      console.error("Error al revalidar la caché de Next.js:", cacheErr);
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error general no controlado al actualizar el entrenamiento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verify ownership
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Entrenamiento no encontrado" },
        { status: 404 }
      );
    }

    if (workout.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    await prisma.workout.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete workout error:", error);
    return NextResponse.json(
      { error: "Error al eliminar entrenamiento" },
      { status: 500 }
    );
  }
}
