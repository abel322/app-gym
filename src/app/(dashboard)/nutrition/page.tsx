import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NutritionClient from "./NutritionClient";

export default async function NutritionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get all user nutrition plans, ordered by updatedAt desc to put active plan first
  const plans = await prisma.nutritionPlan.findMany({
    where: { userId: session.user.id },
    include: {
      meals: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardLayout
      title="Nutrición"
      description="Gestiona tus planes de alimentación semanales"
    >
      <NutritionClient plans={plans} />
    </DashboardLayout>
  );
}
