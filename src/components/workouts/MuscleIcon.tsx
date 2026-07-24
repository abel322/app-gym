import React from "react";
import {
  Dumbbell,
  Activity,
  Flame,
  Shield,
  Heart,
  Footprints,
  BicepsFlexed,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MuscleBadgeResult {
  icon: LucideIcon;
  bg: string;
  label: string;
}

/**
 * Retorna el icono, clases de fondo/texto y etiqueta por defecto para un ejercicio o grupo muscular.
 */
export const getMuscleBadge = (
  exerciseName: string = "",
  muscleGroup: string = ""
): MuscleBadgeResult => {
  const name = (exerciseName || "").toLowerCase();
  const muscle = (muscleGroup || "").toLowerCase();

  if (
    name.includes("biceps") ||
    name.includes("triceps") ||
    name.includes("bíceps") ||
    name.includes("tríceps") ||
    muscle.includes("brazo") ||
    muscle.includes("arm")
  ) {
    return {
      icon: BicepsFlexed,
      bg: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
      label: "Brazos",
    };
  }
  if (
    name.includes("sentadilla") ||
    name.includes("aductor") ||
    name.includes("zancada") ||
    name.includes("prensa") ||
    muscle.includes("pierna") ||
    muscle.includes("leg")
  ) {
    return {
      icon: Activity,
      bg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      label: "Piernas",
    };
  }
  if (
    name.includes("press") ||
    name.includes("pecho") ||
    name.includes("fondo") ||
    muscle.includes("pecho") ||
    muscle.includes("chest")
  ) {
    return {
      icon: Flame,
      bg: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
      label: "Pecho",
    };
  }
  if (
    name.includes("remo") ||
    name.includes("espalda") ||
    name.includes("dominada") ||
    name.includes("peso muerto") ||
    muscle.includes("espalda") ||
    muscle.includes("back")
  ) {
    return {
      icon: Shield,
      bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      label: "Espalda",
    };
  }
  if (
    name.includes("militar") ||
    name.includes("elevacion") ||
    name.includes("elevación") ||
    muscle.includes("hombro") ||
    muscle.includes("shoulder")
  ) {
    return {
      icon: Heart,
      bg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      label: "Hombros",
    };
  }
  if (
    name.includes("plancha") ||
    name.includes("abs") ||
    muscle.includes("cintura") ||
    muscle.includes("core") ||
    muscle.includes("abdomen")
  ) {
    return {
      icon: Footprints,
      bg: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
      label: "Core",
    };
  }
  return {
    icon: Dumbbell,
    bg: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    label: muscleGroup || "General",
  };
};

/**
 * Elimina la etiqueta "(Generado por IA)" si existe en el título del ejercicio.
 */
export function sanitizeExerciseName(name: string = ""): string {
  if (!name) return "";
  return name.replace(/\s*\(Generado por IA\)/gi, "").trim();
}

interface MuscleIconProps {
  exerciseName?: string;
  muscleGroup?: string;
  className?: string;
  containerClassName?: string;
}

export function MuscleIcon({
  exerciseName = "",
  muscleGroup = "",
  className = "w-5 h-5",
  containerClassName = "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
}: MuscleIconProps) {
  const badge = getMuscleBadge(exerciseName, muscleGroup);
  const IconComponent = badge.icon;

  return (
    <div className={cn(containerClassName, badge.bg)}>
      <IconComponent className={className} />
    </div>
  );
}
