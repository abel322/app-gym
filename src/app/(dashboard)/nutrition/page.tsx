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

  // Get user's first nutrition plan, assuming one active plan for now
  // For the requested features, we focus on the first plan
  const plan = await prisma.nutritionPlan.findFirst({
    where: { userId: session.user.id },
    include: {
      meals: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout
      title="Nutrición"
      description="Gestiona tus planes de alimentación semanales"
    >
      <NutritionClient plan={plan} />
    </DashboardLayout>
  );
}
