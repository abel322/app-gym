import React from "react";
import {
  Footprints,
  Dumbbell,
  Flame,
  Shield,
  Zap,
  Target,
  HeartPulse,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MuscleBadgeResult {
  icon: LucideIcon;
  bg: string;
  label: string;
}

/**
 * Retorna el icono, clases de fondo/texto/borde y etiqueta coherente para un ejercicio o grupo muscular.
 * Evalúa PRIMERO la categoría principal o grupo muscular asignado al ejercicio antes que el nombre.
 */
export const getMuscleBadge = (
  exerciseName: string = "",
  muscleGroup: string = ""
): MuscleBadgeResult => {
  const muscle = (muscleGroup || "").toLowerCase();
  const name = (exerciseName || "").toLowerCase();

  // 1. Piernas / Tren Inferior (PRIORIDAD MÁXIMA)
  if (
    muscle.includes("pierna") ||
    muscle.includes("leg") ||
    muscle.includes("cuadricep") ||
    muscle.includes("cuádricep") ||
    muscle.includes("femoral") ||
    muscle.includes("gluteo") ||
    muscle.includes("glúteo") ||
    muscle.includes("aductor") ||
    muscle.includes("abductor") ||
    muscle.includes("pantorrilla") ||
    name.includes("sentadilla") ||
    name.includes("prensa") ||
    name.includes("aductor") ||
    name.includes("abductor") ||
    name.includes("zancada") ||
    name.includes("peso muerto") ||
    name.includes("hip thrust")
  ) {
    return {
      icon: Footprints,
      bg: "bg-blue-500/20 text-blue-400 border border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400",
      label: "Piernas",
    };
  }

  // 2. Brazos / Bíceps / Tríceps
  if (
    muscle.includes("brazo") ||
    muscle.includes("biceps") ||
    muscle.includes("triceps") ||
    muscle.includes("bíceps") ||
    muscle.includes("tríceps") ||
    muscle.includes("antebrazo") ||
    muscle.includes("arm") ||
    name.includes("curl") ||
    name.includes("biceps") ||
    name.includes("triceps") ||
    name.includes("bíceps") ||
    name.includes("tríceps")
  ) {
    return {
      icon: Dumbbell,
      bg: "bg-purple-500/20 text-purple-400 border border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400",
      label: "Brazos",
    };
  }

  // 3. Pecho / Pectorales
  if (
    muscle.includes("pecho") ||
    muscle.includes("chest") ||
    muscle.includes("pectoral") ||
    name.includes("press") ||
    name.includes("apertura") ||
    name.includes("fondo") ||
    name.includes("flexion") ||
    name.includes("flexión")
  ) {
    return {
      icon: Flame,
      bg: "bg-red-500/20 text-red-400 border border-red-500/30 dark:bg-red-500/20 dark:text-red-400",
      label: "Pecho",
    };
  }

  // 4. Espalda
  if (
    muscle.includes("espalda") ||
    muscle.includes("back") ||
    muscle.includes("dorsal") ||
    muscle.includes("trapecio") ||
    name.includes("remo") ||
    name.includes("dominada") ||
    name.includes("jalon") ||
    name.includes("jalón") ||
    name.includes("pulldown")
  ) {
    return {
      icon: Shield,
      bg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400",
      label: "Espalda",
    };
  }

  // 5. Hombros
  if (
    muscle.includes("hombro") ||
    muscle.includes("shoulder") ||
    muscle.includes("deltoid") ||
    name.includes("militar") ||
    name.includes("elevacion") ||
    name.includes("elevación") ||
    name.includes("press militar")
  ) {
    return {
      icon: Zap,
      bg: "bg-amber-500/20 text-amber-400 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400",
      label: "Hombros",
    };
  }

  // 6. Abdomen / Core
  if (
    muscle.includes("core") ||
    muscle.includes("cintura") ||
    muscle.includes("abs") ||
    muscle.includes("abdomen") ||
    muscle.includes("abdominal") ||
    name.includes("plancha") ||
    name.includes("crunch") ||
    name.includes("elevacion de piernas")
  ) {
    return {
      icon: Target,
      bg: "bg-teal-500/20 text-teal-400 border border-teal-500/30 dark:bg-teal-500/20 dark:text-teal-400",
      label: "Core",
    };
  }

  // 7. Cardio / Calistenia
  if (
    muscle.includes("cardio") ||
    muscle.includes("resistencia") ||
    name.includes("correr") ||
    name.includes("trotar") ||
    name.includes("cinta") ||
    name.includes("bici") ||
    name.includes("soga") ||
    name.includes("salto")
  ) {
    return {
      icon: HeartPulse,
      bg: "bg-pink-500/20 text-pink-400 border border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-400",
      label: "Cardio",
    };
  }

  // Fallback General
  return {
    icon: Dumbbell,
    bg: "bg-slate-500/20 text-slate-400 border border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400",
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
  containerClassName = "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
}: MuscleIconProps) {
  const badge = getMuscleBadge(exerciseName, muscleGroup);
  const IconComponent = badge.icon;

  return (
    <div className={cn(containerClassName, badge.bg)}>
      <IconComponent className={cn("w-5 h-5", className)} />
    </div>
  );
}
