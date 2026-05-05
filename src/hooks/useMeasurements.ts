import { useEffect, useCallback } from "react";
import { useMeasurementsStore } from "@/store/measurementsStore";
import { useSession } from "next-auth/react";

export function useMeasurements() {
  const {
    measurements,
    isLoading,
    error,
    fetchMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
  } = useMeasurementsStore();

  const { data: session, status } = useSession();

  const loadMeasurements = useCallback(async () => {
    if (status === "authenticated") {
      await fetchMeasurements();
    }
  }, [status, fetchMeasurements]);

  useEffect(() => {
    if (session?.user?.id) {
      loadMeasurements();
    }
  }, [session?.user?.id, loadMeasurements]);

  const getLatestMeasurement = useCallback(() => {
    if (measurements.length === 0) return null;
    return measurements[0];
  }, [measurements]);

  const getMeasurementHistory = useCallback(
    (limit?: number) => {
      const sorted = [...measurements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return limit ? sorted.slice(0, limit) : sorted;
    },
    [measurements]
  );

  const getMeasurementsByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return measurements.filter((m) => {
        const date = new Date(m.date);
        return date >= startDate && date <= endDate;
      });
    },
    [measurements]
  );

  return {
    measurements,
    isLoading,
    error,
    loadMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getLatestMeasurement,
    getMeasurementHistory,
    getMeasurementsByDateRange,
  };
}