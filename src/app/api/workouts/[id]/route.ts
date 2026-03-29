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
    const validatedData = workoutSchema.parse(body);

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

    const workout = await prisma.workout.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

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
