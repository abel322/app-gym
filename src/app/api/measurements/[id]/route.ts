import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    const measurement = await prisma.bodyMeasurement.findUnique({
      where: { id: params.id },
    });

    if (!measurement) {
      return NextResponse.json(
        { error: "Medición no encontrada" },
        { status: 404 }
      );
    }

    if (measurement.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    await prisma.bodyMeasurement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete measurement error:", error);
    return NextResponse.json(
      { error: "Error al eliminar medición" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Verify ownership
    const measurement = await prisma.bodyMeasurement.findUnique({
      where: { id: params.id },
    });

    if (!measurement) {
      return NextResponse.json(
        { error: "Medición no encontrada" },
        { status: 404 }
      );
    }

    if (measurement.userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const updatedMeasurement = await prisma.bodyMeasurement.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedMeasurement);
  } catch (error) {
    console.error("Update measurement error:", error);
    return NextResponse.json(
      { error: "Error al actualizar medición" },
      { status: 500 }
    );
  }
}
