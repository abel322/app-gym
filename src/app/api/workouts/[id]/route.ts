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

    const body = await request.json();
    const { name, description, difficulty, duration, weekExercises } = body;
    const validatedData = workoutSchema.parse({ name, description, difficulty, duration });

    // Verify ownership
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: params.id },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: "Entrenamiento no encontrado" },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const workout = await prisma.$transaction(async (tx) => {
      // 1. Update the workout core details
      const updatedWorkout = await tx.workout.update({
        where: { id: params.id },
        data: validatedData,
      });

      // 2. If weekExercises are provided, update them
      if (weekExercises && Array.isArray(weekExercises)) {
        // A. Delete existing workout exercises
        await tx.workoutExercise.deleteMany({
          where: { workoutId: params.id },
        });

        // B. Create new workout exercises
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

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/workouts");
    revalidatePath(`/workouts/${params.id}`);

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Update workout error:", error);
    return NextResponse.json(
      { error: "Error al actualizar entrenamiento" },
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
