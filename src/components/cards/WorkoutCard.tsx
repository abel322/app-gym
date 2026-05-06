"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Workout, DifficultyLevel } from "@/types";
import { Dumbbell, Clock, Flame, ChevronRight, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteWorkout } from "@/app/actions/workout";

interface WorkoutCardProps {
  workout: Workout;
  className?: string;
}

const difficultyColors: Record<DifficultyLevel, string> = {
  BEGINNER: "bg-green-500/10 text-green-500",
  INTERMEDIATE: "bg-yellow-500/10 text-yellow-500",
  ADVANCED: "bg-red-500/10 text-red-500",
};

export function WorkoutCard({ workout, className }: WorkoutCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("¿Estás seguro de que deseas eliminar este entrenamiento?")) {
      startTransition(async () => {
        try {
          await deleteWorkout(workout.id);
        } catch (error) {
          console.error("Failed to delete workout:", error);
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn("overflow-hidden group", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{workout.name}</CardTitle>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    difficultyColors[workout.difficulty]
                  )}
                >
                  {workout.difficulty}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Link href={`/workouts/${workout.id}`}>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {workout.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {workout.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {workout.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{workout.duration} min</span>
              </div>
            )}
            {workout.exercises && (
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span>{workout.exercises.length} ejercicios</span>
              </div>
            )}
          </div>

          <Link href={`/workouts/${workout.id}`}>
            <Button
              variant="ghost"
              className="w-full mt-4 group-hover:bg-primary/5"
            >
              Ver Detalles
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}