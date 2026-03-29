import { create } from "zustand";
import { NutritionPlan, Meal } from "@/types";

interface NutritionState {
  nutritionPlans: NutritionPlan[];
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  setNutritionPlans: (plans: NutritionPlan[]) => void;
  setMeals: (meals: Meal[]) => void;
  addNutritionPlan: (plan: NutritionPlan) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchNutritionPlans: (userId: string) => Promise<void>;
  fetchMeals: (userId: string) => Promise<void>;
  createNutritionPlan: (data: Partial<NutritionPlan>) => Promise<NutritionPlan | null>;
  createMeal: (data: Partial<Meal>) => Promise<Meal | null>;
  deleteNutritionPlan: (id: string) => Promise<void>;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  nutritionPlans: [],
  meals: [],
  isLoading: false,
  error: null,
  setNutritionPlans: (nutritionPlans) => set({ nutritionPlans }),
  setMeals: (meals) => set({ meals }),
  addNutritionPlan: (plan) =>
    set((state) => ({ nutritionPlans: [plan, ...state.nutritionPlans] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchNutritionPlans: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/nutrition?userId=${userId}`);
      if (!response.ok) throw new Error("Error al obtener los planes de nutrición");
      const data = await response.json();
      set({ nutritionPlans: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchMeals: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/nutrition/meals?userId=${userId}`);
      if (!response.ok) throw new Error("Error al obtener las comidas");
      const data = await response.json();
      set({ meals: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  createNutritionPlan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear el plan de nutrición");
      const plan = await response.json();
      set((state) => ({
        nutritionPlans: [plan, ...state.nutritionPlans],
        isLoading: false,
      }));
      return plan;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  createMeal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/nutrition/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear la comida");
      const meal = await response.json();
      set((state) => ({
        meals: [meal, ...state.meals],
        isLoading: false,
      }));
      return meal;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  deleteNutritionPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/nutrition/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar el plan");
      set((state) => ({
        nutritionPlans: state.nutritionPlans.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));