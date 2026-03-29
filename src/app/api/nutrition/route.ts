import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nutritionPlanSchema } from "@/lib/validations";

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

    const plans = await prisma.nutritionPlan.findMany({
      where: { userId: session.user.id },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Get nutrition plans error:", error);
    return NextResponse.json(
      { error: "Error al obtener planes de nutrición" },
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
    const validatedData = nutritionPlanSchema.parse(body);

    const plan = await prisma.nutritionPlan.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
      include: {
        meals: true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Create nutrition plan error:", error);
    return NextResponse.json(
      { error: "Error al crear plan de nutrición" },
      { status: 500 }
    );
  }
}
