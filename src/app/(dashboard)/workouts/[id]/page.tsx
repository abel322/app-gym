import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorkoutDetailsClient } from "./WorkoutDetailsClient";

export default async function WorkoutDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const workout = await prisma.workout.findUnique({
    where: { 
      id: params.id,
      userId: session.user.id
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          workout: true,
        },
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          weight: true,
          height: true,
          age: true,
          gender: true,
          activityLevel: true
        }
      }
    },
  });

  if (!workout) {
    notFound();
  }

  // Calculate surplus target
  let surplusTarget = 2639; // Fallback
  const u = workout.user;
  if (u?.weight && u?.height && u?.age && u?.gender) {
    let bmr = 10 * u.weight + 6.25 * u.height - 5 * u.age;
    bmr += u.gender === "MALE" ? 5 : -161;
    const ACTIVITY_MULTIPLIERS: Record<string, number> = {
      SEDENTARY: 1.2, LIGHTLY_ACTIVE: 1.375, MODERATELY_ACTIVE: 1.55, VERY_ACTIVE: 1.725, EXTRA_ACTIVE: 1.9,
    };
    const multiplier = ACTIVITY_MULTIPLIERS[u.activityLevel || "SEDENTARY"] || 1.2;
    const tdee = bmr * multiplier;
    surplusTarget = Math.round(tdee * 1.10); // +10% for surplus
  }

  return (
    <WorkoutDetailsClient initialWorkout={workout} surplusTarget={surplusTarget} />
  );
}
