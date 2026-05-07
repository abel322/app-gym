"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getFoods() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { createdAt: "desc" },
    });
    return foods;
  } catch (error) {
    console.error("Error fetching foods:", error);
    return [];
  }
}

export async function createFood(data: {
  name: string;
  imageUrl?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("No autorizado");
    }

    const food = await prisma.food.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
      },
    });

    revalidatePath("/dashboard/food-database");
    return food;
  } catch (error: any) {
    console.error("Error creating food:", error);
    throw new Error(error.message || "No se pudo crear el alimento");
  }
}

export async function deleteFood(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("No autorizado");
    }

    await prisma.food.delete({
      where: { id },
    });

    revalidatePath("/dashboard/food-database");
    return true;
  } catch (error: any) {
    console.error("Error deleting food:", error);
    throw new Error(error.message || "No se pudo eliminar el alimento");
  }
}
