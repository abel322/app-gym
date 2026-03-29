export type Gender = "MALE" | "FEMALE" | "OTHER";
export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHTLY_ACTIVE"
  | "MODERATELY_ACTIVE"
  | "VERY_ACTIVE"
  | "EXTRA_ACTIVE";
export type Goal = "LOSE_WEIGHT" | "GAIN_MUSCLE" | "MAINTAIN" | "RECOMPOSITION";
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  gender: Gender | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  goal: Goal | null;
  activityLevel: ActivityLevel | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: Date;
  weight: number | null;
  height: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thighs: number | null;
  calves: number | null;
  neck: number | null;
  shoulders: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  difficulty: DifficultyLevel;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  exercises?: WorkoutExercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string;
  equipment: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise?: Exercise;
  order: number;
  sets: number;
  reps: number;
  restSeconds: number;
  weight: number | null;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  exerciseId: string;
  exercise?: Exercise;
  date: Date;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  nutritionPlanId: string | null;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
  foods?: MealFood[];
}

export interface MealFood {
  id: string;
  mealId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: Date;
  type: string;
  photoUrl: string;
  notes: string | null;
}

export interface Prediction {
  id: string;
  userId: string;
  type: string;
  targetDate: Date;
  targetValue: number;
  confidence: number;
  createdAt: Date;
}

export interface DashboardStats {
  currentWeight: number | null;
  weightChange: number | null;
  bmi: number | null;
  bmiCategory: string | null;
  totalWorkouts: number;
  totalCalories: number;
  streak: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProgressData {
  weight: ChartDataPoint[];
  measurements: Record<string, ChartDataPoint[]>;
  nutrition: ChartDataPoint[];
}