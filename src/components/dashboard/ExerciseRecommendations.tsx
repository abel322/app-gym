"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Target, Zap } from "lucide-react";

import { Gender, Goal } from "@/types";

interface Exercise {
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  rest: string;
  description: string;
}

interface ExerciseRecommendationsProps {
  gender?: Gender | null;
  goal?: Goal | null;
  level?: string;
}

export function ExerciseRecommendations({ gender = "MALE", goal = "GAIN_MUSCLE", level = "INTERMEDIATE" }: ExerciseRecommendationsProps) {
  
  const getExercises = (): Exercise[] => {
    // Ejercicios compuestos fundamentales para ambos géneros
    const compoundExercises: Exercise[] = [
      {
        name: "Sentadilla con Barra",
        muscleGroup: "Piernas/Glúteos",
        sets: "4",
        reps: "6-8",
        rest: "3 min",
        description: "Ejercicio fundamental para piernas y glúteos. Mantén la espalda recta y baja hasta que los muslos estén paralelos al suelo."
      },
      {
        name: "Peso Muerto",
        muscleGroup: "Espalda/Piernas",
        sets: "4",
        reps: "5-6",
        rest: "3 min",
        description: "Excelente para toda la cadena posterior. Mantén la barra cerca del cuerpo y la espalda neutral."
      },
      {
        name: "Press de Banca",
        muscleGroup: "Pecho/Tríceps",
        sets: "4",
        reps: "6-8",
        rest: "2-3 min",
        description: "Fundamental para el desarrollo del pecho. Baja la barra hasta el pecho y empuja con fuerza."
      },
      {
        name: "Press Militar",
        muscleGroup: "Hombros",
        sets: "3",
        reps: "8-10",
        rest: "2 min",
        description: "Desarrolla hombros fuertes. Empuja la barra desde los hombros hasta arriba de la cabeza."
      },
      {
        name: "Dominadas",
        muscleGroup: "Espalda/Bíceps",
        sets: "3",
        reps: "6-10",
        rest: "2 min",
        description: "Excelente para la espalda. Si no puedes hacer dominadas, usa banda elástica o máquina asistida."
      },
    ];

    // Ejercicios adicionales según género
    const femaleSpecific: Exercise[] = [
      {
        name: "Hip Thrust con Barra",
        muscleGroup: "Glúteos",
        sets: "4",
        reps: "10-12",
        rest: "90 seg",
        description: "Excelente para glúteos. Apoya la espalda alta en un banco y empuja la cadera hacia arriba."
      },
      {
        name: "Zancadas con Mancuernas",
        muscleGroup: "Piernas/Glúteos",
        sets: "3",
        reps: "10-12 por pierna",
        rest: "90 seg",
        description: "Trabaja piernas y glúteos de forma unilateral. Mantén el torso erguido."
      },
      {
        name: "Abducción de Cadera",
        muscleGroup: "Glúteo Medio",
        sets: "3",
        reps: "15-20",
        rest: "60 seg",
        description: "Fortalece el glúteo medio. Importante para la estabilidad de cadera."
      },
    ];

    const maleSpecific: Exercise[] = [
      {
        name: "Remo con Barra",
        muscleGroup: "Espalda",
        sets: "4",
        reps: "8-10",
        rest: "2 min",
        description: "Desarrolla grosor en la espalda. Mantén el torso inclinado y tira hacia el abdomen."
      },
      {
        name: "Fondos en Paralelas",
        muscleGroup: "Pecho/Tríceps",
        sets: "3",
        reps: "8-12",
        rest: "90 seg",
        description: "Excelente para pecho inferior y tríceps. Inclínate hacia adelante para enfatizar el pecho."
      },
      {
        name: "Curl de Bíceps con Barra",
        muscleGroup: "Bíceps",
        sets: "3",
        reps: "10-12",
        rest: "90 seg",
        description: "Desarrollo de bíceps. Mantén los codos fijos y controla el movimiento."
      },
    ];

    if (gender === "FEMALE") {
      return [...compoundExercises, ...femaleSpecific];
    } else {
      return [...compoundExercises, ...maleSpecific];
    }
  };

  const exercises = getExercises();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Ejercicios Recomendados para Ganar Masa Muscular
        </CardTitle>
        <CardDescription>
          Rutina optimizada para {gender === "FEMALE" ? "mujeres" : "hombres"} en fase de superávit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Training Tips */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Principios Clave:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Entrena 4-5 días por semana</li>
                  <li>• Prioriza ejercicios compuestos (trabajan múltiples músculos)</li>
                  <li>• Aumenta el peso progresivamente cada semana</li>
                  <li>• Descansa 48-72h entre entrenar el mismo grupo muscular</li>
                  <li>• Duerme 7-9 horas para recuperación óptima</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">{exercise.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                        {exercise.muscleGroup}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-pink-500/10 text-pink-400">
                        {exercise.sets} series
                      </span>
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        {exercise.reps} reps
                      </span>
                      <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-400">
                        Descanso: {exercise.rest}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Split Suggestion */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-3">División Semanal Sugerida:</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lunes:</span>
                <span className="font-medium">Pecho + Tríceps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Martes:</span>
                <span className="font-medium">Espalda + Bíceps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miércoles:</span>
                <span className="font-medium">Descanso o Cardio Ligero</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jueves:</span>
                <span className="font-medium">Piernas + Glúteos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Viernes:</span>
                <span className="font-medium">Hombros + Abdomen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sábado:</span>
                <span className="font-medium">Piernas (énfasis glúteos) {gender === "FEMALE" ? "o Full Body" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domingo:</span>
                <span className="font-medium">Descanso Completo</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
