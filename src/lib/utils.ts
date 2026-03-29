import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidad";
}

export function calculateWaistToHipRatio(waist: number, hips: number): number {
  return waist / hips;
}

export function getWaistToHipCategory(
  ratio: number,
  gender: string
): { category: string; color: string } {
  if (gender === "MALE") {
    if (ratio <= 0.9) return { category: "Bajo riesgo", color: "text-green-500" };
    if (ratio <= 1.0) return { category: "Riesgo moderado", color: "text-yellow-500" };
    return { category: "Alto riesgo", color: "text-red-500" };
  } else {
    if (ratio <= 0.8) return { category: "Bajo riesgo", color: "text-green-500" };
    if (ratio <= 0.85) return { category: "Riesgo moderado", color: "text-yellow-500" };
    return { category: "Alto riesgo", color: "text-red-500" };
  }
}

export function generateColorPalette(): string[] {
  return [
    "#667eea",
    "#f093fb",
    "#4facfe",
    "#fa709a",
    "#fee140",
    "#a8edea",
    "#fed6e3",
    "#d299c2",
    "#fde9d7",
    "#99f2c8",
  ];
}