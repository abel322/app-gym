"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNutritionPlan(data: { name: string; goal: string; targetCalories?: number }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plan = await prisma.nutritionPlan.create({
    data: {
      userId: session.user.id,
      name: data.name,
      goal: data.goal,
      targetCalories: data.targetCalories || null,
    },
  });

  revalidatePath("/nutrition");
  return plan;
}

export async function deleteNutritionPlan(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.nutritionPlan.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/nutrition");
}

export async function addMeal(data: { planId: string; dayOfWeek: number; name: string; description?: string; calories?: number }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const meal = await prisma.meal.create({
    data: {
      planId: data.planId,
      dayOfWeek: data.dayOfWeek,
      name: data.name,
      description: data.description,
      calories: data.calories || null,
    },
  });

  revalidatePath("/nutrition");
  return meal;
}

export async function updateMeal(id: string, data: { name?: string; description?: string; calories?: number }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const meal = await prisma.meal.update({
    where: { id },
    data,
  });

  revalidatePath("/nutrition");
  return meal;
}

export async function deleteMeal(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.meal.delete({
    where: { id },
  });

  revalidatePath("/nutrition");
}

export async function copyDayMeals(planId: string, fromDay: number, toDays: number[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get all meals of source day
  const sourceMeals = await prisma.meal.findMany({
    where: { planId, dayOfWeek: fromDay }
  });

  if (sourceMeals.length === 0) return;

  // Clear target days first, then create copied meals
  await prisma.$transaction(async (tx) => {
    await tx.meal.deleteMany({
      where: {
        planId,
        dayOfWeek: { in: toDays }
      }
    });

    const newMealsData = toDays.flatMap((day) => 
      sourceMeals.map((meal) => ({
        planId,
        dayOfWeek: day,
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
      }))
    );

    if (newMealsData.length > 0) {
      await tx.meal.createMany({
        data: newMealsData
      });
    }
  });

  revalidatePath("/nutrition");
}
