import { useEffect, useCallback } from "react";
import { useWorkoutStore } from "@/store/workoutStore";
import { useSession } from "next-auth/react";

export function useWorkouts() {
  const {
    workouts,
    workoutLogs,
    isLoading,
    error,
    fetchWorkouts,
    fetchWorkoutLogs,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkoutStore();

  const { data: session } = useSession();

  const loadWorkouts = useCallback(async () => {
    if (session?.user?.id) {
      await fetchWorkouts(session.user.id);
    }
  }, [session?.user?.id, fetchWorkouts]);

  const loadWorkoutLogs = useCallback(async () => {
    if (session?.user?.id) {
      await fetchWorkoutLogs(session.user.id);
    }
  }, [session?.user?.id, fetchWorkoutLogs]);

  useEffect(() => {
    if (session?.user?.id) {
      loadWorkouts();
      loadWorkoutLogs();
    }
  }, [session?.user?.id, loadWorkouts, loadWorkoutLogs]);

  const getWorkoutById = useCallback(
    (id: string) => {
      return workouts.find((w) => w.id === id) || null;
    },
    [workouts]
  );

  const getRecentWorkouts = useCallback(
    (limit?: number) => {
      const sorted = [...workouts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return limit ? sorted.slice(0, limit) : sorted;
    },
    [workouts]
  );

  const getWorkoutsByDifficulty = useCallback(
    (difficulty: string) => {
      return workouts.filter((w) => w.difficulty === difficulty);
    },
    [workouts]
  );

  return {
    workouts,
    workoutLogs,
    isLoading,
    error,
    loadWorkouts,
    loadWorkoutLogs,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    getRecentWorkouts,
    getWorkoutsByDifficulty,
  };
}