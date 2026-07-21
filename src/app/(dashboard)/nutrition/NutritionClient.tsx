"use client";

import { useState, useTransition, useOptimistic, useMemo, useEffect } from "react";
import { Plus, Utensils, Trash2, Edit2, Flame, Copy, MoreVertical, Calendar, Info, BarChart3, TrendingUp, Award, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { createNutritionPlan, deleteNutritionPlan, addMeal, updateMeal, deleteMeal, copyDateMeals, setActivePlan } from "@/app/actions/nutrition";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

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
  { id: 1, name: "Lunes", short: "LUN" },
  { id: 2, name: "Martes", short: "MAR" },
  { id: 3, name: "Miércoles", short: "MIÉ" },
  { id: 4, name: "Jueves", short: "JUE" },
  { id: 5, name: "Viernes", short: "VIE" },
  { id: 6, name: "Sábado", short: "SÁB" },
  { id: 7, name: "Domingo", short: "DOM" },
];

// Helper to get Monday of the current week (based on a given date)
function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Helper to parse protein, carbs, fats from description or estimate them
function parseMacros(description: string | null, calories: number | null, goal: string | null) {
  let protein = 0;
  let carbs = 0;
  let fats = 0;

  if (description) {
    const pMatch = description.match(/(?:p|prot|proteinas?)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*g/i);
    const cMatch = description.match(/(?:c|carb|carbohidratos?)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*g/i);
    const gMatch = description.match(/(?:g|f|fats?|grasas?)\s*[:=-]?\s*(\d+(?:\.\d+)?)\s*g/i);

    if (pMatch) protein = Math.round(parseFloat(pMatch[1]));
    if (cMatch) carbs = Math.round(parseFloat(cMatch[1]));
    if (gMatch) fats = Math.round(parseFloat(gMatch[1]));
  }

  // Fallback to estimation based on calories if no macros are specified
  if (protein === 0 && carbs === 0 && fats === 0 && calories) {
    let pPct = 0.30;
    let cPct = 0.50;
    let fPct = 0.20;
    
    if (goal && goal.startsWith("GRAMS:")) {
      try {
        const parsed = JSON.parse(goal.replace("GRAMS:", ""));
        const totalGramsCal = (parsed.p * 4) + (parsed.c * 4) + (parsed.f * 9);
        if (totalGramsCal > 0) {
          pPct = (parsed.p * 4) / totalGramsCal;
          cPct = (parsed.c * 4) / totalGramsCal;
          fPct = (parsed.f * 9) / totalGramsCal;
        }
      } catch (e) {
        console.error("Error parsing grams macros for estimation", e);
      }
    } else if (goal && goal.startsWith("CUSTOM:")) {
      try {
        const parsed = JSON.parse(goal.replace("CUSTOM:", ""));
        pPct = (parsed.p || 30) / 100;
        cPct = (parsed.c || 50) / 100;
        fPct = (parsed.f || 20) / 100;
      } catch (e) {
        console.error("Error parsing custom macros for estimation", e);
      }
    } else {
      const lowerGoal = (goal || "").toLowerCase();
      if (lowerGoal.includes("déficit") || lowerGoal.includes("def") || lowerGoal.includes("lose")) {
        pPct = 0.35;
        cPct = 0.40;
        fPct = 0.25;
      } else if (lowerGoal.includes("mantenimiento") || lowerGoal.includes("maintain")) {
        pPct = 0.25;
        cPct = 0.50;
        fPct = 0.25;
      }
    }
    
    protein = Math.round((calories * pPct) / 4);
    carbs = Math.round((calories * cPct) / 4);
    fats = Math.round((calories * fPct) / 9);
  }

  return { protein, carbs, fats };
}

// Helper to calculate daily macro goals based on target calories
function getDailyMacroTargets(targetCalories: number | null, goal: string | null) {
  const calories = targetCalories || 2000;
  
  if (goal && goal.startsWith("GRAMS:")) {
    try {
      const parsed = JSON.parse(goal.replace("GRAMS:", ""));
      return {
        protein: Number(parsed.p) || 0,
        carbs: Number(parsed.c) || 0,
        fats: Number(parsed.f) || 0,
        goalName: parsed.goal || "Personalizado",
        custom: true,
      };
    } catch (e) {
      console.error("Error parsing grams macros", e);
    }
  }
  
  if (goal && goal.startsWith("CUSTOM:")) {
    try {
      const parsed = JSON.parse(goal.replace("CUSTOM:", ""));
      const pPct = (parsed.p || 30) / 100;
      const cPct = (parsed.c || 50) / 100;
      const fPct = (parsed.f || 20) / 100;
      return {
        protein: Math.round((calories * pPct) / 4),
        carbs: Math.round((calories * cPct) / 4),
        fats: Math.round((calories * fPct) / 9),
        goalName: "Personalizado",
        custom: true,
      };
    } catch (e) {
      console.error("Error parsing custom macros targets", e);
    }
  }
  
  let pPct = 0.30;
  let cPct = 0.50;
  let fPct = 0.20;
  const lowerGoal = (goal || "").toLowerCase();
  if (lowerGoal.includes("déficit") || lowerGoal.includes("def") || lowerGoal.includes("lose")) {
    pPct = 0.35;
    cPct = 0.40;
    fPct = 0.25;
  } else if (lowerGoal.includes("mantenimiento") || lowerGoal.includes("maintain")) {
    pPct = 0.25;
    cPct = 0.50;
    fPct = 0.25;
  }

  return {
    protein: Math.round((calories * pPct) / 4),
    carbs: Math.round((calories * cPct) / 4),
    fats: Math.round((calories * fPct) / 9),
    goalName: goal || "Superávit",
    custom: false,
  };
}

// Simple seedable pseudo-random number generator for stable mock daily logs
function seedRandom(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(Math.sin(hash)) * 1000 % 1;
}

export default function NutritionClient({ plans }: { plans: Plan[] }) {
  const [isPending, startTransition] = useTransition();
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [copyTargetDays, setCopyTargetDays] = useState<number[]>([]);
  
  // Multiple plans state
  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activePlanId");
      if (saved && plans.some(p => p.id === saved)) return saved;
    }
    return plans[0]?.id || null;
  });

  const plan = useMemo(() => {
    return plans.find(p => p.id === activePlanId) || plans[0] || null;
  }, [plans, activePlanId]);

  // Week Selection state
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [activeDayDate, setActiveDayDate] = useState<string>(() => {
    const monday = getMonday(new Date());
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date();
    const diff = (today.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24);
    if (diff >= 0 && diff < 7) {
      return todayStr;
    }
    return monday.toISOString().split("T")[0];
  });

  // Analytics and History states
  const [dateFilter, setDateFilter] = useState<"7" | "14" | "30">("7");
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any | null>(null);

  // Form states for Plan
  const [planName, setPlanName] = useState("");
  const [planGoal, setPlanGoal] = useState("Superávit");
  const [planCalories, setPlanCalories] = useState<number | "">("");
  const [macroProtein, setMacroProtein] = useState<number | "">("");
  const [macroCarbs, setMacroCarbs] = useState<number | "">("");
  const [macroFats, setMacroFats] = useState<number | "">("");

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

  // Auto calculate estimated grams of macros inside New Plan Modal
  const handleCaloriesChange = (val: number | "") => {
    setPlanCalories(val);
    if (val) {
      let pPct = 0.30;
      let cPct = 0.50;
      let fPct = 0.20;
      
      if (planGoal === "Déficit") {
        pPct = 0.35;
        cPct = 0.40;
        fPct = 0.25;
      } else if (planGoal === "Mantenimiento") {
        pPct = 0.25;
        cPct = 0.50;
        fPct = 0.25;
      }
      
      setMacroProtein(Math.round((Number(val) * pPct) / 4));
      setMacroCarbs(Math.round((Number(val) * cPct) / 4));
      setMacroFats(Math.round((Number(val) * fPct) / 9));
    } else {
      setMacroProtein("");
      setMacroCarbs("");
      setMacroFats("");
    }
  };

  const handleGoalChange = (newGoal: string) => {
    setPlanGoal(newGoal);
    if (planCalories) {
      let pPct = 0.30;
      let cPct = 0.50;
      let fPct = 0.20;
      
      if (newGoal === "Déficit") {
        pPct = 0.35;
        cPct = 0.40;
        fPct = 0.25;
      } else if (newGoal === "Mantenimiento") {
        pPct = 0.25;
        cPct = 0.50;
        fPct = 0.25;
      }
      
      setMacroProtein(Math.round((Number(planCalories) * pPct) / 4));
      setMacroCarbs(Math.round((Number(planCalories) * cPct) / 4));
      setMacroFats(Math.round((Number(planCalories) * fPct) / 9));
    }
  };

  // Sync plan switch selection and re-touch server-side updatedAt active ranking
  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
    setIsPlanDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("activePlanId", planId);
    }
    startTransition(async () => {
      try {
        await setActivePlan(planId);
      } catch (e) {
        console.error("Error setting active plan", e);
      }
    });
  };

  // Week Selector change week handlers
  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  // Format week range label
  const weekRangeStr = useMemo(() => {
    const monday = currentWeekStart;
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const optionsShort: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const optionsYear: Intl.DateTimeFormatOptions = { year: "numeric" };
    
    const startStr = monday.toLocaleDateString("es-ES", optionsShort);
    const endStr = sunday.toLocaleDateString("es-ES", optionsShort);
    const yearStr = sunday.toLocaleDateString("es-ES", optionsYear);
    
    return `Semana: ${startStr} - ${endStr}, ${yearStr}`;
  }, [currentWeekStart]);

  // Compute weekdays details dynamically based on selected week Monday
  const weekDays = useMemo(() => {
    return DAYS.map((day, index) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + index);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayNum = d.getDate();
      return {
        ...day,
        dateStr,
        dayNum,
        label: `${day.name} ${dayNum}`,
        shortLabel: `${day.short} ${dayNum}`,
      };
    });
  }, [currentWeekStart]);

  // Sync activeDayDate when week start changes
  useEffect(() => {
    const currentWeekDates = DAYS.map((_, index) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + index);
      return d.toISOString().split("T")[0];
    });
    
    if (!currentWeekDates.includes(activeDayDate)) {
      setActiveDayDate(currentWeekDates[0]);
    }
  }, [currentWeekStart, activeDayDate]);

  // Parse meals to retrieve calendar date prefixes and clean descriptions
  const parsedMeals = useMemo(() => {
    return optimisticMeals.map((meal) => {
      let dateStr = "";
      let cleanDescription = meal.description || "";
      
      if (meal.description && meal.description.startsWith("[DATE:")) {
        const match = meal.description.match(/^\[DATE:(\d{4}-\d{2}-\d{2})\]\s*(.*)/);
        if (match) {
          dateStr = match[1];
          cleanDescription = match[2];
        }
      }
      
      // Legacy fallback: map dayOfWeek (1-7) to corresponding weekday date of active viewed week
      if (!dateStr) {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + (meal.dayOfWeek - 1));
        dateStr = d.toISOString().split("T")[0];
      }
      
      return {
        ...meal,
        dateStr,
        cleanDescription,
      };
    });
  }, [optimisticMeals, currentWeekStart]);

  const handleCreatePlan = () => {
    if (!planName || !planCalories) return;

    const pGrams = macroProtein ? Number(macroProtein) : 0;
    const cGrams = macroCarbs ? Number(macroCarbs) : 0;
    const fGrams = macroFats ? Number(macroFats) : 0;

    // Serialize macros goals inside the goal column string
    const finalGoal = `GRAMS:${JSON.stringify({
      goal: planGoal,
      p: pGrams,
      c: cGrams,
      f: fGrams
    })}`;

    startTransition(async () => {
      try {
        const newPlan = await createNutritionPlan({
          name: planName,
          goal: finalGoal,
          targetCalories: planCalories ? Number(planCalories) : undefined,
        });
        if (newPlan) {
          setActivePlanId(newPlan.id);
          if (typeof window !== "undefined") {
            localStorage.setItem("activePlanId", newPlan.id);
          }
        }
        setIsNewPlanModalOpen(false);
        // Reset states
        setPlanName("");
        setPlanCalories("");
        setPlanGoal("Superávit");
        setMacroProtein("");
        setMacroCarbs("");
        setMacroFats("");
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
        const remainingPlans = plans.filter(p => p.id !== plan.id);
        if (remainingPlans.length > 0) {
          setActivePlanId(remainingPlans[0].id);
          if (typeof window !== "undefined") {
            localStorage.setItem("activePlanId", remainingPlans[0].id);
          }
        } else {
          setActivePlanId(null);
        }
      } catch (e) {
        console.error("Error deleting plan", e);
      }
    });
  };

  const openMealModal = (meal?: Meal & { cleanDescription?: string }) => {
    if (meal) {
      setEditingMeal(meal);
      setMealName(meal.name);
      setMealDescription(meal.cleanDescription || meal.description || "");
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
    if (!plan || !activeDayDate) return;
    const caloriesVal = mealCalories ? Number(mealCalories) : undefined;
    const finalDescription = `[DATE:${activeDayDate}] ${mealDescription}`;
    
    const dateObj = new Date(activeDayDate);
    const dayOfWeek = dateObj.getDay() === 0 ? 7 : dateObj.getDay();
    
    startTransition(async () => {
      if (editingMeal) {
        addOptimisticMeal({
          ...editingMeal,
          name: mealName,
          description: finalDescription,
          calories: caloriesVal || null,
          dayOfWeek,
        });
        
        await updateMeal(editingMeal.id, {
          name: mealName,
          description: finalDescription,
          calories: caloriesVal,
        });
      } else {
        const tempId = Math.random().toString();
        addOptimisticMeal({
          id: tempId,
          planId: plan.id,
          dayOfWeek,
          name: mealName,
          description: finalDescription,
          calories: caloriesVal || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await addMeal({
          planId: plan.id,
          dayOfWeek,
          name: mealName,
          description: finalDescription,
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

  const handleCopyMeals = () => {
    if (!plan || copyTargetDays.length === 0) return;
    
    const targetDateStrs = copyTargetDays.map(dayId => {
      const found = weekDays.find(wd => wd.id === dayId);
      return found ? found.dateStr : "";
    }).filter(Boolean);

    startTransition(async () => {
      try {
        await copyDateMeals(plan.id, activeDayDate, targetDateStrs);
        setIsCopyDialogOpen(false);
        setCopyTargetDays([]);
      } catch (e) {
        console.error("Error copying plan", e);
      }
    });
  };

  // Group meals for the active day date
  const activeDayMeals = useMemo(() => {
    return parsedMeals.filter(m => m.dateStr === activeDayDate);
  }, [parsedMeals, activeDayDate]);

  const groupedMeals = useMemo(() => {
    const groups: Record<string, typeof activeDayMeals> = {
      "Desayuno": [],
      "Almuerzo": [],
      "Cena": [],
      "Snacks": [],
      "Otros": [],
    };

    activeDayMeals.forEach((meal) => {
      const nameLower = meal.name.toLowerCase();
      if (nameLower.includes("desayuno") || nameLower.includes("breakfast") || nameLower.includes("mañana")) {
        groups["Desayuno"].push(meal);
      } else if (nameLower.includes("almuerzo") || nameLower.includes("lunch") || nameLower.includes("comida")) {
        groups["Almuerzo"].push(meal);
      } else if (nameLower.includes("cena") || nameLower.includes("dinner")) {
        groups["Cena"].push(meal);
      } else if (nameLower.includes("snack") || nameLower.includes("merienda") || nameLower.includes("colacion") || nameLower.includes("colación")) {
        groups["Snacks"].push(meal);
      } else {
        groups["Otros"].push(meal);
      }
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return groups;
  }, [activeDayMeals]);

  // Consumed calculations
  const dayNutrition = useMemo(() => {
    return activeDayMeals.reduce((acc, meal) => {
      const macros = parseMacros(meal.description, meal.calories, plan?.goal);
      return {
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + macros.protein,
        carbs: acc.carbs + macros.carbs,
        fats: acc.fats + macros.fats,
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [activeDayMeals, plan?.goal]);

  const targets = useMemo(() => {
    return getDailyMacroTargets(plan?.targetCalories || null, plan?.goal || null);
  }, [plan?.targetCalories, plan?.goal]);

  // --- MOCK HISTORICAL DATA GENERATION ---
  const historicalRecords = useMemo(() => {
    if (!plan) return [];
    const records = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
      
      const seed = seedRandom(dateStr);
      const targetCals = plan.targetCalories || 2000;
      
      const dayMeals = parsedMeals.filter(m => m.dateStr === dateStr);
      
      let baseCalories = dayMeals.reduce((acc, curr) => acc + (curr.calories || 0), 0);
      let baseProtein = 0;
      let baseCarbs = 0;
      let baseFats = 0;
      
      dayMeals.forEach(meal => {
        const macros = parseMacros(meal.description, meal.calories, plan.goal);
        baseProtein += macros.protein;
        baseCarbs += macros.carbs;
        baseFats += macros.fats;
      });

      let consumedCalories = baseCalories;
      let consumedProtein = baseProtein;
      let consumedCarbs = baseCarbs;
      let consumedFats = baseFats;
      
      if (baseCalories === 0 && optimisticMeals.length > 0) {
        consumedCalories = Math.round(targetCals * (0.82 + seed * 0.30));
        const fallbackMacros = getDailyMacroTargets(consumedCalories, plan.goal);
        consumedProtein = fallbackMacros.protein;
        consumedCarbs = fallbackMacros.carbs;
        consumedFats = fallbackMacros.fats;
      } else if (baseCalories > 0) {
        const factor = 0.82 + seed * 0.32;
        consumedCalories = Math.round(baseCalories * factor);
        consumedProtein = Math.round(baseProtein * factor);
        consumedCarbs = Math.round(baseCarbs * factor);
        consumedFats = Math.round(baseFats * factor);
      }
      
      let status: "Completado" | "Bajo Meta" | "Excedido" = "Completado";
      const diff = consumedCalories - targetCals;
      if (diff < -150) {
        status = "Bajo Meta";
      } else if (diff > 150) {
        status = "Excedido";
      }

      records.push({
        date: dateStr,
        dateFormatted: d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
        dateFull: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
        dayName: DAYS.find(day => day.id === dayOfWeek)?.name || "",
        dayOfWeek,
        targetCalories: targetCals,
        consumedCalories,
        protein: consumedProtein,
        carbs: consumedCarbs,
        fats: consumedFats,
        status,
      });
    }
    
    return records;
  }, [plan, optimisticMeals, parsedMeals]);

  // Filter records based on active select dropdown (7, 14, 30 days)
  const filteredRecords = useMemo(() => {
    const limit = Number(dateFilter);
    return historicalRecords.slice(-limit);
  }, [historicalRecords, dateFilter]);

  // Calculate stats KPIs
  const kpis = useMemo(() => {
    if (filteredRecords.length === 0) return { avgCalories: 0, complianceRate: 0, proteinStreak: 0 };
    
    const totalCals = filteredRecords.reduce((acc, r) => acc + r.consumedCalories, 0);
    const avgCalories = Math.round(totalCals / filteredRecords.length);
    
    const compliantDays = filteredRecords.filter(r => {
      const ratio = r.consumedCalories / r.targetCalories;
      return ratio >= 0.9 && ratio <= 1.1;
    }).length;
    const complianceRate = Math.round((compliantDays / filteredRecords.length) * 100);
    
    let proteinStreak = 0;
    const minProtein = targets.protein * 0.9;
    
    for (let i = filteredRecords.length - 1; i >= 0; i--) {
      if (filteredRecords[i].protein >= minProtein) {
        proteinStreak++;
      } else {
        break;
      }
    }
    
    return { avgCalories, complianceRate, proteinStreak };
  }, [filteredRecords, targets]);

  // Calculate average macronutrient breakdown for PieChart
  const avgMacros = useMemo(() => {
    if (filteredRecords.length === 0) return [];
    const totalProtein = filteredRecords.reduce((acc, r) => acc + r.protein, 0);
    const totalCarbs = filteredRecords.reduce((acc, r) => acc + r.carbs, 0);
    const totalFats = filteredRecords.reduce((acc, r) => acc + r.fats, 0);
    
    const count = filteredRecords.length;
    return [
      { name: "Proteínas", value: Math.round(totalProtein / count), color: "#3b82f6" },
      { name: "Carbohidratos", value: Math.round(totalCarbs / count), color: "#eab308" },
      { name: "Grasas", value: Math.round(totalFats / count), color: "#ec4899" },
    ];
  }, [filteredRecords]);

  // Show active plan helper text
  const planGoalLabel = useMemo(() => {
    if (!plan) return "";
    if (plan.goal && plan.goal.startsWith("GRAMS:")) {
      try {
        const parsed = JSON.parse(plan.goal.replace("GRAMS:", ""));
        return parsed.goal || "Personalizado";
      } catch {
        return "Personalizado";
      }
    }
    if (plan.goal && plan.goal.startsWith("CUSTOM:")) {
      return "Personalizado";
    }
    return plan.goal;
  }, [plan]);

  // Shared Helper modal component for plan creation
  function renderCreatePlanModal() {
    return (
      <Dialog open={isNewPlanModalOpen} onOpenChange={setIsNewPlanModalOpen}>
        <DialogContent className="sm:max-w-[425px] border-purple-100 dark:border-white/10 z-50 bg-white dark:bg-zinc-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-900 dark:text-purple-100">
              Nuevo Plan Nutricional
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid gap-1.5">
              <Label htmlFor="planName" className="font-semibold text-gray-700 dark:text-slate-300">Nombre del Plan</Label>
              <Input
                id="planName"
                placeholder="Ej: Definición Verano, Volumen Limpio"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="planGoal" className="font-semibold text-gray-700 dark:text-slate-300">Tipo de Objetivo</Label>
              <Select value={planGoal} onValueChange={handleGoalChange}>
                <SelectTrigger className="focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Superávit">Superávit Calórico (Volumen)</SelectItem>
                  <SelectItem value="Déficit">Déficit Calórico (Definición)</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="planCalories" className="font-semibold text-gray-700 dark:text-slate-300">Meta de Calorías Diarias (Kcal)</Label>
              <Input
                id="planCalories"
                type="number"
                placeholder="Ej: 2200"
                value={planCalories}
                onChange={(e) => handleCaloriesChange(e.target.value ? Number(e.target.value) : "")}
                className="focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700 dark:text-slate-300">Metas de Macronutrientes (Gramos)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="macroProtein" className="text-xs text-blue-500 font-bold">Proteínas (g)</Label>
                  <Input
                    id="macroProtein"
                    type="number"
                    placeholder="e.g. 150"
                    value={macroProtein}
                    onChange={(e) => setMacroProtein(e.target.value ? Number(e.target.value) : "")}
                    className="focus-visible:ring-blue-500 text-center font-bold"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="macroCarbs" className="text-xs text-yellow-600 dark:text-yellow-500 font-bold">Carbs (g)</Label>
                  <Input
                    id="macroCarbs"
                    type="number"
                    placeholder="e.g. 250"
                    value={macroCarbs}
                    onChange={(e) => setMacroCarbs(e.target.value ? Number(e.target.value) : "")}
                    className="focus-visible:ring-yellow-500 text-center font-bold"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="macroFats" className="text-xs text-pink-500 font-bold">Grasas (g)</Label>
                  <Input
                    id="macroFats"
                    type="number"
                    placeholder="e.g. 70"
                    value={macroFats}
                    onChange={(e) => setMacroFats(e.target.value ? Number(e.target.value) : "")}
                    className="focus-visible:ring-pink-500 text-center font-bold"
                  />
                </div>
              </div>
              {planCalories && macroProtein && macroCarbs && macroFats && (
                <div className="text-[10px] text-right font-semibold text-muted-foreground pt-1">
                  Calorías Calculadas: <span className="text-purple-600 font-bold">{(Number(macroProtein) * 4) + (Number(macroCarbs) * 4) + (Number(macroFats) * 9)} kcal</span> vs Meta: <span className="font-bold">{planCalories} kcal</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 border-t pt-3 border-gray-100 dark:border-white/5">
            <Button variant="outline" onClick={() => setIsNewPlanModalOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button 
              disabled={isPending || !planName || !planCalories} 
              onClick={handleCreatePlan} 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
            >
              {isPending ? "Guardando..." : "Guardar y Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (plans.length === 0) {
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
          onClick={() => setIsNewPlanModalOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Plan Nutricional
        </Button>

        {renderCreatePlanModal()}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Plan Header Selector */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Dynamic Plan Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-85 text-left capitalize transition-opacity"
              >
                <span>{plan.name}</span>
                <ChevronDown className="h-5 w-5 text-purple-600 shrink-0" />
              </button>
              {isPlanDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsPlanDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-1.5 z-20 animate-in fade-in slide-in-from-top-1">
                    <div className="text-[10px] font-bold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">Tus Planes</div>
                    <div className="space-y-0.5 max-h-48 overflow-y-auto">
                      {plans.map((p) => {
                        const isActive = p.id === activePlanId;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectPlan(p.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 text-sm rounded-xl transition-colors flex items-center justify-between",
                              isActive
                                ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-semibold"
                                : "text-gray-700 dark:text-slate-300 hover:bg-muted"
                            )}
                          >
                            <span className="truncate">{p.name}</span>
                            {isActive && <span className="text-xs bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded-full">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 dark:border-white/5 my-1.5" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlanDropdownOpen(false);
                        setIsNewPlanModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-xl transition-colors text-left"
                    >
                      <Plus className="w-4 h-4" />
                      Crear Nuevo Plan
                    </button>
                  </div>
                </>
              )}
            </div>

            <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider">
              {planGoalLabel}
            </span>
          </div>
          {plan.targetCalories && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500 font-medium mt-1">
              <Flame className="w-4 h-4 mr-1 text-orange-500" />
              Meta diaria: <span className="ml-1 text-gray-700 dark:text-slate-300 font-semibold">{plan.targetCalories} kcal</span>
            </div>
          )}
        </div>

        {/* Options Dropdown */}
        <div className="relative shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowOptions(!showOptions)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            aria-label="Opciones de plan"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-xl shadow-lg p-1 z-20 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    handleDeletePlan();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Borrar Plan
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 max-w-sm bg-muted">
          <TabsTrigger value="weekly" className="py-2.5 text-sm">Plan Semanal</TabsTrigger>
          <TabsTrigger value="history" className="py-2.5 text-sm">Historial y Métricas</TabsTrigger>
        </TabsList>

        {/* Weekly Plan Tab Content */}
        <TabsContent value="weekly" className="space-y-6 outline-none">
          {/* Week Selector Section */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevWeek}
              className="h-9 w-9 rounded-xl hover:bg-muted"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Button>
            <span className="text-xs sm:text-sm font-extrabold text-purple-700 dark:text-purple-400 flex items-center gap-2 uppercase tracking-wide">
              <Calendar className="h-4 w-4 shrink-0 text-purple-500" />
              {weekRangeStr}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              className="h-9 w-9 rounded-xl hover:bg-muted"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>

          {/* Weekly Navigation Dynamic Capsules */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin snap-x">
            {weekDays.map((day) => {
              const dayMeals = parsedMeals.filter(m => m.dateStr === day.dateStr);
              const totalCals = dayMeals.reduce((acc, curr) => acc + (curr.calories || 0), 0);
              const isActive = activeDayDate === day.dateStr;
              
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDayDate(day.dateStr)}
                  className={cn(
                    "flex-1 min-w-[95px] snap-center flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-white border-primary shadow-md"
                      : "bg-white dark:bg-zinc-900 text-card-foreground border-gray-100 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/35"
                  )}
                >
                  <span className="text-[10px] sm:text-xs opacity-75 font-semibold uppercase leading-none">{day.short}</span>
                  <span className="text-base sm:text-lg font-bold mt-1.5 leading-none">{day.dayNum}</span>
                  <span className="text-[10px] opacity-75 mt-1">{totalCals} kcal</span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Nutrition Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calorie Progress Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-600 dark:text-slate-400">Progreso Calórico</span>
                <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
                  {dayNutrition.calories} <span className="text-sm font-normal text-muted-foreground">/ {plan.targetCalories || 2000} kcal</span>
                </span>
              </div>
              <Progress 
                value={plan.targetCalories ? Math.min(100, (dayNutrition.calories / plan.targetCalories) * 100) : 0} 
                className="h-3" 
                indicatorClassName={dayNutrition.calories > (plan.targetCalories || 2000) ? "bg-orange-500" : "bg-gradient-primary"}
              />
            </div>

            {/* Macros Breakdown Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-center space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Protein */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-blue-500">PROT</span>
                    <span className="text-muted-foreground">{dayNutrition.protein}g / {targets.protein}g</span>
                  </div>
                  <Progress 
                    value={targets.protein ? Math.min(100, (dayNutrition.protein / targets.protein) * 100) : 0} 
                    className="h-2 bg-blue-500/10" 
                    indicatorClassName="bg-blue-500" 
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-yellow-600 dark:text-yellow-500">CARB</span>
                    <span className="text-muted-foreground">{dayNutrition.carbs}g / {targets.carbs}g</span>
                  </div>
                  <Progress 
                    value={targets.carbs ? Math.min(100, (dayNutrition.carbs / targets.carbs) * 100) : 0} 
                    className="h-2 bg-yellow-500/10" 
                    indicatorClassName="bg-yellow-500" 
                  />
                </div>

                {/* Fats */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-pink-500">GRAS</span>
                    <span className="text-muted-foreground">{dayNutrition.fats}g / {targets.fats}g</span>
                  </div>
                  <Progress 
                    value={targets.fats ? Math.min(100, (dayNutrition.fats / targets.fats) * 100) : 0} 
                    className="h-2 bg-pink-500/10" 
                    indicatorClassName="bg-pink-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (Copy Plan, Add Meal) */}
          <div className="flex justify-between items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Comidas del {
                weekDays.find(d => d.dateStr === activeDayDate) 
                  ? `${weekDays.find(d => d.dateStr === activeDayDate)?.name} ${weekDays.find(d => d.dateStr === activeDayDate)?.dayNum}` 
                  : ""
              }
            </h3>
            <div className="flex gap-2">
              {activeDayMeals.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCopyDialogOpen(true)}
                  className="text-xs h-9"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Plan
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => openMealModal()}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white h-9"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Agregar Comida
              </Button>
            </div>
          </div>

          {/* Grouped Meal Cards */}
          <div className="space-y-4">
            {activeDayMeals.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/20 rounded-full flex items-center justify-center mb-3">
                  <Utensils className="h-6 w-6 text-purple-600/70" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Sin comidas programadas</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                  Agrega tus alimentos para este día o copia el plan de otro día.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 bg-white dark:bg-zinc-900"
                  onClick={() => openMealModal()}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Agregar Comida
                </Button>
              </div>
            ) : (
              Object.entries(groupedMeals).map(([timeGroup, meals]) => {
                if (meals.length === 0) return null;
                return (
                  <div key={timeGroup} className="space-y-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">{timeGroup}</h4>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {meals.map((meal) => {
                        const mealMacros = parseMacros(meal.description, meal.calories, plan.goal);
                        return (
                          <div key={meal.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative group/meal hover:border-purple-200 dark:hover:border-purple-500/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <h5 className="font-bold text-gray-800 dark:text-slate-200 truncate pr-8">{meal.name}</h5>
                                {meal.cleanDescription && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{meal.cleanDescription}</p>
                                )}
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                  <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-md">
                                    P: {mealMacros.protein}g
                                  </span>
                                  <span className="text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-semibold px-2 py-0.5 rounded-md">
                                    C: {mealMacros.carbs}g
                                  </span>
                                  <span className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold px-2 py-0.5 rounded-md">
                                    G: {mealMacros.fats}g
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {meal.calories && (
                                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 px-2 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                    {meal.calories} kcal
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Actions overlay */}
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover/meal:opacity-100 transition-opacity bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-lg p-0.5 border shadow-sm">
                              <button onClick={() => openMealModal(meal)} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-md hover:bg-muted">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteMeal(meal.id)} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-muted">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* History and Metrics Tab Content */}
        <TabsContent value="history" className="space-y-6 outline-none">
          {/* Filters section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">Filtro de Rango</h3>
              <p className="text-xs text-muted-foreground">Selecciona el periodo de análisis para tus métricas</p>
            </div>
            <div className="w-full sm:w-48 shrink-0">
              <Select value={dateFilter} onValueChange={(val: any) => setDateFilter(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar rango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="14">Últimos 14 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* KPI Metrics Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden bg-white dark:bg-zinc-900">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Promedio de Calorías</p>
                  <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{kpis.avgCalories} kcal</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                  <Flame className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden bg-white dark:bg-zinc-900">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cumplimiento de Meta</p>
                  <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{kpis.complianceRate}%</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden bg-white dark:bg-zinc-900">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Racha Proteica</p>
                  <p className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">{kpis.proteinStreak} días</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-pink-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calorie Trend Chart */}
            <Card className="lg:col-span-2 border border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-base font-bold text-gray-800 dark:text-slate-200">Tendencia de Calorías</CardTitle>
                <p className="text-xs text-muted-foreground">Comparativa diaria de consumo vs meta calórica</p>
              </CardHeader>
              <CardContent className="p-5">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filteredRecords} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                      <XAxis dataKey="dateFormatted" fontSize={10} stroke="#9ca3af" tickLine={false} />
                      <YAxis fontSize={10} stroke="#9ca3af" tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="consumedCalories"
                        name="Consumido"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTrend)"
                      />
                      <Line
                        type="monotone"
                        dataKey="targetCalories"
                        name="Meta"
                        stroke="#db2777"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Macro Distribution Donut Chart */}
            <Card className="border border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-base font-bold text-gray-800 dark:text-slate-200">Desglose de Macros</CardTitle>
                <p className="text-xs text-muted-foreground">Distribución promedio de macros consumidos</p>
              </CardHeader>
              <CardContent className="p-5 flex flex-col items-center justify-center">
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={avgMacros}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {avgMacros.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => `${val}g`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Log Table Card */}
          <Card className="border border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="p-5">
              <CardTitle className="text-base font-bold text-gray-800 dark:text-slate-200">Registro Histórico de Comidas</CardTitle>
              <p className="text-xs text-muted-foreground">Historial detallado de consumo nutricional por día</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="border-y border-gray-100 dark:border-white/10 bg-muted/30 text-muted-foreground font-semibold text-xs uppercase">
                      <th className="p-4 pl-6">Fecha</th>
                      <th className="p-4">Calorías (Cons. vs Meta)</th>
                      <th className="p-4">Prot</th>
                      <th className="p-4">Carbs</th>
                      <th className="p-4">Grasas</th>
                      <th className="p-4 text-center">Estado</th>
                      <th className="p-4 pr-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredRecords].reverse().map((record) => (
                      <tr key={record.date} className="border-b border-gray-100 dark:border-white/5 hover:bg-muted/10 transition-colors">
                        <td className="p-4 pl-6 font-semibold">
                          <div>{record.dateFull}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">{record.dayName}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-700 dark:text-slate-200">{record.consumedCalories}</span>
                          <span className="text-xs text-muted-foreground"> / {record.targetCalories} kcal</span>
                        </td>
                        <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">{record.protein}g</td>
                        <td className="p-4 text-yellow-600 dark:text-yellow-500 font-semibold">{record.carbs}g</td>
                        <td className="p-4 text-pink-600 dark:text-pink-400 font-semibold">{record.fats}g</td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border",
                            record.status === "Completado" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                            record.status === "Bajo Meta" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
                            record.status === "Excedido" && "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20"
                          )}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedHistoryRecord(record)}
                            className="h-8 text-xs font-semibold px-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-600 dark:text-purple-400"
                          >
                            Ver Detalle <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Detailed Meals Dialog */}
      <Dialog open={selectedHistoryRecord !== null} onOpenChange={(open) => !open && setSelectedHistoryRecord(null)}>
        {selectedHistoryRecord && (
          <DialogContent className="sm:max-w-[450px] border-purple-100 dark:border-white/10 max-h-[85vh] overflow-y-auto font-sans">
            <DialogHeader>
              <DialogTitle className="text-xl text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Detalle del Día {selectedHistoryRecord.dateFull}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 space-y-4 text-sm">
              <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold">Consumo</span>
                  <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400 leading-tight">
                    {selectedHistoryRecord.consumedCalories} kcal
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">P</span>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{selectedHistoryRecord.protein}g</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">C</span>
                    <p className="font-bold text-yellow-600 dark:text-yellow-500">{selectedHistoryRecord.carbs}g</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">G</span>
                    <p className="font-bold text-pink-600 dark:text-pink-400">{selectedHistoryRecord.fats}g</p>
                  </div>
                </div>
              </div>

              {/* Meals list inside history record */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-0.5">Comidas del Plan</h4>
                {parsedMeals.filter(m => m.dateStr === selectedHistoryRecord.date).length === 0 ? (
                  <p className="text-xs italic text-muted-foreground py-4 text-center">Sin comidas registradas en la plantilla de este día.</p>
                ) : (
                  parsedMeals.filter(m => m.dateStr === selectedHistoryRecord.date).map((meal) => {
                    const mealMacros = parseMacros(meal.description, meal.calories, plan.goal);
                    return (
                      <div key={meal.id} className="border border-gray-100 dark:border-white/5 rounded-xl p-3 bg-white dark:bg-zinc-900/50 shadow-sm text-sm">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-800 dark:text-slate-200">{meal.name}</span>
                          {meal.calories && <span className="text-purple-600 dark:text-purple-400 font-semibold">{meal.calories} kcal</span>}
                        </div>
                        {meal.cleanDescription && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{meal.cleanDescription}</p>
                        )}
                        <div className="flex gap-1.5 mt-2">
                          <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded">
                            P: {mealMacros.protein}g
                          </span>
                          <span className="text-[9px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-semibold px-2 py-0.5 rounded">
                            C: {mealMacros.carbs}g
                          </span>
                          <span className="text-[9px] bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold px-2 py-0.5 rounded">
                            G: {mealMacros.fats}g
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedHistoryRecord(null)} className="bg-purple-600 hover:bg-purple-700 text-white w-full font-semibold">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Copy Plan Dialog */}
      <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-purple-100 dark:border-white/10 z-50 bg-white dark:bg-zinc-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Copy className="h-5 w-5 text-purple-600" />
              Copiar Plan del Día
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm">
            <p className="text-sm text-muted-foreground mb-4">
              Copia las comidas de este día ({weekDays.find(d => d.dateStr === activeDayDate)?.name} {weekDays.find(d => d.dateStr === activeDayDate)?.dayNum}) a los días seleccionados de esta semana.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => {
                if (day.dateStr === activeDayDate) return null;
                const isSelected = copyTargetDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      if (isSelected) {
                        setCopyTargetDays(copyTargetDays.filter(d => d !== day.id));
                      } else {
                        setCopyTargetDays([...copyTargetDays, day.id]);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all text-left",
                      isSelected 
                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-500 text-purple-700 dark:text-purple-300"
                        : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/5 text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <span>{day.name} {day.dayNum}</span>
                    <span className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center text-[10px]",
                      isSelected ? "border-purple-600 bg-purple-600 text-white font-bold" : "border-gray-300 dark:border-white/10"
                    )}>
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 border-t pt-3 border-gray-100 dark:border-white/5">
            <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button disabled={isPending || copyTargetDays.length === 0} onClick={handleCopyMeals} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
              {isPending ? "Copiando..." : "Copiar Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meal Modal (Add/Edit Meal) */}
      <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
        <DialogContent className="sm:max-w-[420px] border-purple-100 dark:border-white/10 z-50 bg-white dark:bg-zinc-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-purple-600" />
              {editingMeal ? "Editar Comida" : "Agregar Comida"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid gap-2">
              <Label htmlFor="mealName">Nombre (ej: Desayuno, Almuerzo, Snack de Tarde)</Label>
              <Input
                id="mealName"
                placeholder="Ej: Almuerzo Completo"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="mealDesc">Descripción y Alimentos</Label>
                <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-semibold cursor-help group relative">
                  <Info className="h-3 w-3" />
                  Tip de macros
                  <span className="absolute bottom-full right-0 mb-1 hidden group-hover:block w-48 bg-slate-900 text-white text-[9px] p-2 rounded shadow-lg font-normal z-50">
                    Escribe "P: 30g, C: 45g, G: 10g" en tu descripción para calcular tus macros exactos automáticamente.
                  </span>
                </div>
              </div>
              <Input
                id="mealDesc"
                placeholder="Ej: 200g Pollo, 100g Arroz. (P: 45g, C: 42g, G: 5g)"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mealCals">Calorías (kcal)</Label>
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
          <DialogFooter className="border-t pt-3 border-gray-100 dark:border-white/5">
            <Button disabled={isPending || !mealName} onClick={handleSaveMeal} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white w-full">
              {isPending ? "Guardando..." : "Guardar Comida"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renderCreatePlanModal()}
    </div>
  );
}
