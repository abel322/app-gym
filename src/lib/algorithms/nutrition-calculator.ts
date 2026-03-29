interface NutritionData {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
}

interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealPlan {
  meals: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    percentage: number;
  }[];
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  // Mifflin-St Jeor Equation
  if (gender === "MALE") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const activityMultipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9,
  };

  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
}

export function calculateMacros(data: NutritionData): MacroResult {
  const { weight, height, age, gender, activityLevel, goal } = data;

  const bmr = calculateBMR(weight, height, age, gender);
  let tdee = calculateTDEE(bmr, activityLevel);

  // Adjust for goal
  let calories: number;
  let proteinRatio: number;
  let carbRatio: number;
  let fatRatio: number;

  switch (goal) {
    case "LOSE_WEIGHT":
      calories = Math.round(tdee * 0.8); // 20% deficit
      proteinRatio = 0.35;
      carbRatio = 0.35;
      fatRatio = 0.30;
      break;
    case "GAIN_MUSCLE":
      calories = Math.round(tdee * 1.15); // 15% surplus
      proteinRatio = 0.30;
      carbRatio = 0.45;
      fatRatio = 0.25;
      break;
    case "RECOMPOSITION":
      calories = tdee;
      proteinRatio = 0.35;
      carbRatio = 0.40;
      fatRatio = 0.25;
      break;
    default: // MAINTAIN
      calories = tdee;
      proteinRatio = 0.30;
      carbRatio = 0.40;
      fatRatio = 0.30;
  }

  // Calculate grams (protein = 4 cal/g, carbs = 4 cal/g, fat = 9 cal/g)
  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbRatio) / 4);
  const fat = Math.round((calories * fatRatio) / 9);

  return {
    calories,
    protein,
    carbs,
    fat,
  };
}

export function generateMealPlan(
  calories: number,
  mealCount: number = 4
): MealPlan {
  const distributions: Record<number, number[]> = {
    3: [0.35, 0.35, 0.30],
    4: [0.30, 0.30, 0.25, 0.15],
    5: [0.25, 0.30, 0.20, 0.15, 0.10],
    6: [0.20, 0.25, 0.20, 0.15, 0.10, 0.10],
  };

  const mealNames = ["Desayuno", "Almuerzo", "Merienda", "Cena"];

  const distribution = distributions[mealCount] || distributions[4];

  const meals = distribution.map((percentage, index) => {
    const mealCalories = Math.round(calories * percentage);
    // Approximate macros (40% protein, 40% carbs, 20% fat)
    const protein = Math.round((mealCalories * 0.4) / 4);
    const carbs = Math.round((mealCalories * 0.4) / 4);
    const fat = Math.round((mealCalories * 0.2) / 9);

    return {
      name: mealNames[index] || `Comida ${index + 1}`,
      calories: mealCalories,
      protein,
      carbs,
      fat,
      percentage: Math.round(percentage * 100),
    };
  });

  return { meals };
}

export function calculateMealMacros(
  foods: { name: string; quantity: number; unit: string }[]
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  // Common food database (simplified)
  const foodDatabase: Record<
    string,
    { calories: number; protein: number; carbs: number; fat: number }
  > = {
    "pollo": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    "arroz": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    "huevo": { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    "plátano": { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    "aguacate": { calories: 160, protein: 2, carbs: 9, fat: 15 },
    "salmón": { calories: 208, protein: 20, carbs: 0, fat: 13 },
    "brócoli": { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    "patata": { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
    "yogur": { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    "pan": { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    "leche": { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
    "queso": { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
    "manzana": { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    "zanahoria": { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    "atún": { calories: 132, protein: 29, carbs: 0, fat: 1 },
  };

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  foods.forEach((food) => {
    const normalizedName = food.name.toLowerCase();
    const foodData = foodDatabase[normalizedName];

    if (foodData) {
      // Scale by quantity (assuming quantity is in units or 100g)
      const multiplier = food.unit === "g" ? food.quantity / 100 : food.quantity;
      totalCalories += foodData.calories * multiplier;
      totalProtein += foodData.protein * multiplier;
      totalCarbs += foodData.carbs * multiplier;
      totalFat += foodData.fat * multiplier;
    }
  });

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fat: Math.round(totalFat),
  };
}