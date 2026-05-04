import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateBMI, getBMICategory } from "@/lib/utils";
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get latest measurement
    const latestMeasurement = await prisma.bodyMeasurement.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // Get measurement from 7 days ago for comparison
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const previousMeasurement = await prisma.bodyMeasurement.findFirst({
      where: {
        userId,
        date: { lte: sevenDaysAgo },
      },
      orderBy: { date: "desc" },
    });

    // Calculate weight change
    let weightChange = null;
    if (latestMeasurement?.weight && previousMeasurement?.weight) {
      weightChange = latestMeasurement.weight - previousMeasurement.weight;
    }

    // Get user data for BMI calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { height: true, weight: true },
    });

    let bmi = null;
    let bmiCategory = null;
    if (user?.weight && user?.height) {
      bmi = calculateBMI(user.weight, user.height);
      bmiCategory = getBMICategory(bmi);
    }

    // Count total workouts
    const totalWorkouts = await prisma.workoutLog.count({
      where: { userId },
    });

    // Count workouts this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = await prisma.workoutLog.count({
      where: {
        userId,
        date: { gte: startOfWeek },
      },
    });

    // Get total calories from nutrition plans
    const nutritionPlans = await prisma.nutritionPlan.findMany({
      where: { userId },
      select: { calories: true },
    });

    const totalCalories = nutritionPlans.reduce(
      (sum, plan) => sum + plan.calories,
      0
    );

    // Calculate streak (consecutive days with workouts)
    const recentLogs = await prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
      select: { date: true },
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDates = [
      ...new Set(
        recentLogs.map((log) => {
          const d = new Date(log.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (uniqueDates[i] === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      currentWeight: latestMeasurement?.weight || null,
      weightChange,
      bmi,
      bmiCategory,
      totalWorkouts,
      workoutsThisWeek,
      totalCalories,
      streak,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
