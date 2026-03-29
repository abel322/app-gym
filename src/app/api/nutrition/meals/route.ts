import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mealSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const meals = await prisma.meal.findMany({
      where: { userId: session.user.id },
      include: {
        foods: true,
        nutritionPlan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(meals);
  } catch (error) {
    console.error("Get meals error:", error);
    return NextResponse.json(
      { error: "Error al obtener comidas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = mealSchema.parse(body);

    const meal = await prisma.meal.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
      include: {
        foods: true,
      },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Create meal error:", error);
    return NextResponse.json(
      { error: "Error al crear comida" },
      { status: 500 }
    );
  }
}
