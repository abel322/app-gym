"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNutrition } from "@/hooks/useNutrition";
import { Plus, Utensils } from "lucide-react";

export default function NutritionPage() {
  const { nutritionPlans, meals, isLoading } = useNutrition();

  return (
    <DashboardLayout
      title="Nutrición"
      description="Gestiona tus planes de alimentación"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>

        {nutritionPlans.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nutritionPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>Calorías: {plan.calories} kcal</p>
                    <p>Proteína: {plan.protein}g</p>
                    <p>Carbohidratos: {plan.carbs}g</p>
                    <p>Grasas: {plan.fat}g</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Utensils className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay planes de nutrición</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer plan nutricional
            </p>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear Plan
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
