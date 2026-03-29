import { create } from "zustand";
import { BodyMeasurement } from "@/types";

interface MeasurementsState {
  measurements: BodyMeasurement[];
  isLoading: boolean;
  error: string | null;
  setMeasurements: (measurements: BodyMeasurement[]) => void;
  addMeasurement: (measurement: BodyMeasurement) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMeasurements: (userId: string) => Promise<void>;
  createMeasurement: (data: Partial<BodyMeasurement>) => Promise<BodyMeasurement | null>;
  deleteMeasurement: (id: string) => Promise<void>;
}

export const useMeasurementsStore = create<MeasurementsState>((set, get) => ({
  measurements: [],
  isLoading: false,
  error: null,
  setMeasurements: (measurements) => set({ measurements }),
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [measurement, ...state.measurements] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchMeasurements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/measurements?userId=${userId}`);
      if (!response.ok) throw new Error("Error al obtener las mediciones");
      const data = await response.json();
      set({ measurements: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  createMeasurement: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear la medición");
      const measurement = await response.json();
      set((state) => ({
        measurements: [measurement, ...state.measurements],
        isLoading: false,
      }));
      return measurement;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
  deleteMeasurement: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/measurements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar la medición");
      set((state) => ({
        measurements: state.measurements.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));