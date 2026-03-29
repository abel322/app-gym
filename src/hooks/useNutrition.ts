import { useEffect, useCallback } from "react";
import { useNutritionStore } from "@/store/nutritionStore";
import { useSession } from "next-auth/react";
import { calculateMacros, generateMealPlan } from "@/lib/algorithms/nutrition-calculator";

export function useNutrition() {
  const {
    nutritionPlans,
    meals,
    isLoading,
    error,
    fetchNutritionPlans,
    fetchMeals,
    createNutritionPlan,
    createMeal,
    deleteNutritionPlan,
  } = useNutritionStore();

  const { data: session } = useSession();

  const loadNutritionPlans = useCallback(async () => {
    if (session?.user?.id) {
      await fetchNutritionPlans(session.user.id);
    }
  }, [session?.user?.id, fetchNutritionPlans]);

  const loadMeals = useCallback(async () => {
    if (session?.user?.id) {
      await fetchMeals(session.user.id);
    }
  }, [session?.user?.id, fetchMeals]);

  useEffect(() => {
    if (session?.user?.id) {
      loadNutritionPlans();
      loadMeals();
    }
  }, [session?.user?.id, loadNutritionPlans, loadMeals]);

  const getLatestNutritionPlan = useCallback(() => {
    if (nutritionPlans.length === 0) return null;
    return nutritionPlans[0];
  }, [nutritionPlans]);

  const getMealsByPlan = useCallback(
    (planId: string) => {
      return meals.filter((m) => m.nutritionPlanId === planId);
    },
    [meals]
  );

  const generateAutoPlan = useCallback(
    (userData: {
      weight: number;
      height: number;
      age: number;
      gender: string;
      activityLevel: string;
      goal: string;
    }) => {
      const macros = calculateMacros(userData);
      return {
        ...macros,
        mealPlan: generateMealPlan(macros.calories),
      };
    },
    []
  );

  return {
    nutritionPlans,
    meals,
    isLoading,
    error,
    loadNutritionPlans,
    loadMeals,
    createNutritionPlan,
    createMeal,
    deleteNutritionPlan,
    getLatestNutritionPlan,
    getMealsByPlan,
    generateAutoPlan,
  };
}