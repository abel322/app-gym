import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  age: z.number().min(10).max(120).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  goal: z.enum(["LOSE_WEIGHT", "GAIN_MUSCLE", "MAINTAIN", "RECOMPOSITION"]).optional(),
  activityLevel: z.enum([
    "SEDENTARY",
    "LIGHTLY_ACTIVE",
    "MODERATELY_ACTIVE",
    "VERY_ACTIVE",
    "EXTRA_ACTIVE",
  ]).optional(),
});

export const measurementSchema = z.object({
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()).default(() => new Date()),
  weight: z.number().min(20).max(300).nullable().optional(),
  height: z.number().min(100).max(250).nullable().optional(),
  chest: z.number().min(20).max(200).nullable().optional(),
  waist: z.number().min(20).max(200).nullable().optional(),
  hips: z.number().min(20).max(200).nullable().optional(),
  biceps: z.number().min(10).max(100).nullable().optional(),
  thighs: z.number().min(10).max(100).nullable().optional(),
  calves: z.number().min(10).max(100).nullable().optional(),
  neck: z.number().min(10).max(100).nullable().optional(),
  shoulders: z.number().min(20).max(200).nullable().optional(),
  bodyFat: z.number().min(1).max(60).nullable().optional(),
  muscleMass: z.number().min(10).max(150).nullable().optional(),
});

export const workoutSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().nullable().optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  duration: z.number().min(5).max(180).nullable().optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  muscleGroup: z.string(),
  equipment: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

export const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  order: z.number().default(0),
  sets: z.number().min(1).max(20).default(3),
  reps: z.number().min(1).max(100).default(10),
  restSeconds: z.number().min(0).max(600).default(60),
  weight: z.number().min(0).optional(),
});

export const workoutLogSchema = z.object({
  workoutId: z.string(),
  exerciseId: z.string(),
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
});

export const nutritionPlanSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  calories: z.number().min(500).max(10000),
  protein: z.number().min(0).max(500),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(500),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const mealSchema = z.object({
  nutritionPlanId: z.string().optional(),
  name: z.string().min(2),
  time: z.string(),
  calories: z.number().min(0).max(5000),
  protein: z.number().min(0).max(500),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(500),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type WorkoutExerciseInput = z.infer<typeof workoutExerciseSchema>;
export type WorkoutLogInput = z.infer<typeof workoutLogSchema>;
export type NutritionPlanInput = z.infer<typeof nutritionPlanSchema>;
export type MealInput = z.infer<typeof mealSchema>;