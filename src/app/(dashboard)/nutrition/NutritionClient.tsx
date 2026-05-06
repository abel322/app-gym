"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Plus, Utensils, Trash2, Edit2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNutritionPlan, deleteNutritionPlan, addMeal, updateMeal, deleteMeal } from "@/app/actions/nutrition";

type Meal = {
  id: string;
  planId: string;
  dayOfWeek: number;
  name: string;
  description: string | null;
  calories: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type Plan = {
  id: string;
  userId: string;
  name: string;
  goal: string | null;
  targetCalories: number | null;
  createdAt: Date;
  updatedAt: Date;
  meals: Meal[];
};

const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
];

export default function NutritionClient({ plan }: { plan: Plan | null }) {
  const [isPending, startTransition] = useTransition();
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  // Form states for Plan
  const [planName, setPlanName] = useState("");
  const [planGoal, setPlanGoal] = useState("Superávit");
  const [planCalories, setPlanCalories] = useState<number | "">("");

  // Form states for Meal
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [mealCalories, setMealCalories] = useState<number | "">("");

  const [optimisticMeals, addOptimisticMeal] = useOptimistic(
    plan?.meals || [],
    (state: Meal[], newMeal: Meal | { action: 'delete'; id: string }) => {
      if ('action' in newMeal && newMeal.action === 'delete') {
        return state.filter(m => m.id !== newMeal.id);
      }
      const isUpdate = state.some(m => m.id === (newMeal as Meal).id);
      if (isUpdate) {
        return state.map(m => m.id === (newMeal as Meal).id ? (newMeal as Meal) : m);
      }
      return [...state, newMeal as Meal];
    }
  );

  const handleCreatePlan = () => {
    startTransition(async () => {
      try {
        await createNutritionPlan({
          name: planName,
          goal: planGoal,
          targetCalories: planCalories ? Number(planCalories) : undefined,
        });
        setIsCreatePlanOpen(false);
      } catch (e) {
        console.error("Error creating plan", e);
      }
    });
  };

  const handleDeletePlan = () => {
    if (!plan || !confirm("¿Seguro que deseas eliminar este plan y todas sus comidas?")) return;
    startTransition(async () => {
      try {
        await deleteNutritionPlan(plan.id);
      } catch (e) {
        console.error("Error deleting plan", e);
      }
    });
  };

  const openMealModal = (dayId: number, meal?: Meal) => {
    setSelectedDay(dayId);
    if (meal) {
      setEditingMeal(meal);
      setMealName(meal.name);
      setMealDescription(meal.description || "");
      setMealCalories(meal.calories || "");
    } else {
      setEditingMeal(null);
      setMealName("");
      setMealDescription("");
      setMealCalories("");
    }
    setIsMealModalOpen(true);
  };

  const handleSaveMeal = () => {
    if (!plan || !selectedDay) return;
    const caloriesVal = mealCalories ? Number(mealCalories) : undefined;
    
    startTransition(async () => {
      if (editingMeal) {
        // Optimistic update
        addOptimisticMeal({
          ...editingMeal,
          name: mealName,
          description: mealDescription,
          calories: caloriesVal || null,
        });
        
        await updateMeal(editingMeal.id, {
          name: mealName,
          description: mealDescription,
          calories: caloriesVal,
        });
      } else {
        const tempId = Math.random().toString();
        // Optimistic add
        addOptimisticMeal({
          id: tempId,
          planId: plan.id,
          dayOfWeek: selectedDay,
          name: mealName,
          description: mealDescription,
          calories: caloriesVal || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await addMeal({
          planId: plan.id,
          dayOfWeek: selectedDay,
          name: mealName,
          description: mealDescription,
          calories: caloriesVal,
        });
      }
      setIsMealModalOpen(false);
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    if (!confirm("¿Eliminar esta comida?")) return;
    startTransition(async () => {
      addOptimisticMeal({ action: 'delete', id: mealId });
      await deleteMeal(mealId);
    });
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Utensils className="h-12 w-12 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-slate-100">No tienes un plan activo</h3>
        <p className="text-muted-foreground mb-8 max-w-md text-gray-500 dark:text-slate-400">
          Crea tu primer plan nutricional y organiza tus comidas para la semana. Enfócate en tu objetivo de manera estructurada.
        </p>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none transition-all px-8 py-6 rounded-xl text-lg font-medium"
          onClick={() => setIsCreatePlanOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Plan Nutricional
        </Button>

        {/* Create Plan Modal */}
        <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
          <DialogContent className="sm:max-w-[425px] border-purple-100 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl text-purple-900 dark:text-purple-100">Nuevo Plan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Plan</Label>
                <Input
                  id="name"
                  placeholder="Ej: Fase de Volumen Intenso"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="focus-visible:ring-purple-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal">Objetivo</Label>
                <Select value={planGoal} onValueChange={setPlanGoal}>
                  <SelectTrigger className="focus:ring-purple-500">
                    <SelectValue placeholder="Selecciona tu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Superávit">Superávit Calórico (Volumen)</SelectItem>
                    <SelectItem value="Déficit">Déficit Calórico (Definición)</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calorías Objetivo Diarias (Kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Ej: 3200"
                  value={planCalories}
                  onChange={(e) => setPlanCalories(e.target.value ? Number(e.target.value) : "")}
                  className="focus-visible:ring-purple-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isPending || !planName} onClick={handleCreatePlan} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white w-full">
                {isPending ? "Creando..." : "Crear Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{plan.name}</h2>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full uppercase tracking-wider">
              {plan.goal}
            </span>
          </div>
          {plan.targetCalories && (
            <div className="flex items-center text-sm text-gray-500 font-medium">
              <Flame className="w-4 h-4 mr-1 text-orange-500" />
              Meta diaria: <span className="ml-1 text-gray-700 dark:text-slate-300">{plan.targetCalories} kcal</span>
            </div>
          )}
        </div>
        <Button variant="destructive" size="sm" onClick={handleDeletePlan} className="bg-red-50 hover:bg-red-100 text-red-600 border-0 shadow-none">
          <Trash2 className="w-4 h-4 mr-2" />
          Borrar Plan
        </Button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const dayMeals = optimisticMeals.filter(m => m.dayOfWeek === day.id);
          const totalDayCalories = dayMeals.reduce((acc, curr) => acc + (curr.calories || 0), 0);
          const progress = plan.targetCalories ? Math.min(100, (totalDayCalories / plan.targetCalories) * 100) : 0;
          const isOver = plan.targetCalories && totalDayCalories > plan.targetCalories;

          return (
            <div key={day.id} className="flex flex-col gap-3">
              <div className="bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-100/80 dark:border-white/5 shadow-sm relative overflow-hidden group transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-700 dark:text-slate-200">{day.name}</h3>
                  <div className={`text-xs font-semibold ${isOver ? 'text-orange-500' : 'text-purple-600 dark:text-purple-400'}`}>
                    {totalDayCalories} kcal
                  </div>
                </div>

                {/* Progress bar if target is set */}
                {plan.targetCalories && (
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 mb-4 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${isOver ? 'bg-orange-500' : 'bg-purple-500'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Meals List */}
                <div className="space-y-2 mb-4 min-h-[100px]">
                  {dayMeals.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 dark:text-slate-500 py-6 italic">
                      Sin comidas
                    </div>
                  ) : (
                    dayMeals.map((meal) => (
                      <div key={meal.id} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-100 dark:border-white/10 shadow-sm text-sm group/meal relative hover:border-purple-200 dark:hover:border-purple-500/50 transition-colors">
                        <div className="font-semibold text-gray-800 dark:text-slate-200 flex justify-between">
                          {meal.name}
                          {meal.calories && <span className="text-gray-500 dark:text-slate-400 text-xs font-normal">{meal.calories} kcal</span>}
                        </div>
                        {meal.description && (
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {meal.description}
                          </div>
                        )}
                        
                        {/* Actions overlay */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/meal:opacity-100 transition-opacity bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-md p-0.5 shadow-sm">
                          <button onClick={() => openMealModal(day.id, meal)} className="p-1 text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteMeal(meal.id)} className="p-1 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Meal Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-dashed border-purple-200 dark:border-purple-500/30 bg-white dark:bg-zinc-900"
                  onClick={() => openMealModal(day.id)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Agregar Comida
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meal Modal */}
      <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-purple-100 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl text-purple-900 dark:text-purple-100">
              {editingMeal ? "Editar Comida" : "Agregar Comida"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mealName">Nombre (ej: Almuerzo, Snack)</Label>
              <Input
                id="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mealDesc">Descripción (Alimentos)</Label>
              <Input
                id="mealDesc"
                placeholder="Ej: 200g Pollo, 100g Arroz"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mealCals">Calorías (opcional)</Label>
              <Input
                id="mealCals"
                type="number"
                placeholder="Ej: 600"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value ? Number(e.target.value) : "")}
                className="focus-visible:ring-purple-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isPending || !mealName} onClick={handleSaveMeal} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white w-full">
              {isPending ? "Guardando..." : "Guardar Comida"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
