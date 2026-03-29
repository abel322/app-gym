import { create } from "zustand";
import { Workout, WorkoutLog } from "@/types";

interface WorkoutState {
  workouts: Workout[];
  workoutLogs: WorkoutLog[];
  isLoading: boolean;
  error: string | null;
  setWorkouts: (workouts: Workout[]) => void;
  setWorkoutLogs: (logs: WorkoutLog[]) => void;
  addWorkout: (workout: Workout) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchWorkouts: (userId: string) => Promise<void>;
  fetchWorkoutLogs: (userId: string) => Promise<void>;
  createWorkout: (data: Partial<Workout>) => Promise<Workout | null>;
  updateWorkout: (id: string, data: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  workoutLogs: [],
  isLoading: false,
  error: null,
  setWorkouts: (workouts) => set({ workouts }),
  setWorkoutLogs: (workoutLogs) => set({ workoutLogs }),
  addWorkout: (workout) =>
    set((state) => ({ workouts: [workout, ...state.workouts] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchWorkouts: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workouts?userId=${userId}`);
      if (!response.ok) throw new Error("Error al obtener los entrenamientos");
      const data = await response.json();
      set({ workouts: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchWorkoutLogs: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workouts/logs?userId=${userId}`);
      if (!response.ok) throw new Error("Error al obtener los registros");
      const data = await response.json();
      set({ workoutLogs: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  createWorkout: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear el entrenamiento");
      const workout = await response.json();
      set((state) => ({
        workouts: [workout, ...state.workouts],
        isLoading: false,
      }));
      return workout;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  updateWorkout: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar el entrenamiento");
      const updatedWorkout = await response.json();
      set((state) => ({
        workouts: state.workouts.map((w) =>
          w.id === id ? updatedWorkout : w
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  deleteWorkout: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar el entrenamiento");
      set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));