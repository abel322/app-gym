"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFoods() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { createdAt: "desc" },
    });
    return foods;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw new Error("Error fetching foods");
  }
}

export async function createFood(data: {
  name: string;
  imageUrl?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}) {
  try {
    const food = await prisma.food.create({
      data,
    });
    revalidatePath("/dashboard/food-database");
    return food;
  } catch (error) {
    console.error("Error creating food:", error);
    throw new Error("Error creating food");
  }
}

export async function deleteFood(id: string) {
  try {
    await prisma.food.delete({
      where: { id },
    });
    revalidatePath("/dashboard/food-database");
    return true;
  } catch (error) {
    console.error("Error deleting food:", error);
    throw new Error("Error deleting food");
  }
}
