"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteWorkout(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.workout.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/workouts");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteWorkout Server Action:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}
