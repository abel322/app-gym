interface DataPoint {
  date: Date;
  value: number;
}

interface PredictionResult {
  date: Date;
  value: number;
  confidence: number;
}

// Simple Linear Regression for predictions
function linearRegression(data: DataPoint[]): {
  slope: number;
  intercept: number;
  r2: number;
} {
  const n = data.length;
  if (n < 2) {
    return { slope: 0, intercept: data[0]?.value || 0, r2: 0 };
  }

  const xMean = data.reduce((sum, p) => sum + p.date.getTime(), 0) / n;
  const yMean = data.reduce((sum, p) => sum + p.value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  data.forEach((point) => {
    const xDiff = point.date.getTime() - xMean;
    numerator += xDiff * (point.value - yMean);
    denominator += xDiff * xDiff;
  });

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  const yPredictions = data.map((point) => slope * point.date.getTime() + intercept);
  const ssRes = data.reduce(
    (sum, point, i) => sum + Math.pow(point.value - yPredictions[i], 2),
    0
  );
  const ssTot = data.reduce((sum, point) => sum + Math.pow(point.value - yMean, 2), 0);
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r2 };
}

export function predictWeight(
  measurements: { date: Date; weight: number }[],
  targetDate: Date
): PredictionResult {
  if (measurements.length < 2) {
    return { date: targetDate, value: measurements[0]?.weight || 0, confidence: 0 };
  }

  const data = measurements.map((m) => ({
    date: new Date(m.date),
    value: m.weight,
  }));

  const { slope, intercept, r2 } = linearRegression(data);
  const predictedValue = slope * targetDate.getTime() + intercept;
  const confidence = Math.max(0, Math.min(1, r2));

  return {
    date: targetDate,
    value: Math.max(0, predictedValue),
    confidence,
  };
}

export function predictMuscleGrowth(
  measurements: { date: Date; muscleMass: number }[],
  targetDate: Date
): PredictionResult {
  if (measurements.length < 2) {
    return {
      date: targetDate,
      value: measurements[0]?.muscleMass || 0,
      confidence: 0,
    };
  }

  const data = measurements.map((m) => ({
    date: new Date(m.date),
    value: m.muscleMass,
  }));

  const { slope, intercept, r2 } = linearRegression(data);
  const predictedValue = slope * targetDate.getTime() + intercept;
  const confidence = Math.max(0, Math.min(1, r2));

  return {
    date: targetDate,
    value: Math.max(0, predictedValue),
    confidence,
  };
}

export function predictBodyMeasurements(
  measurements: {
    date: Date;
    measurements: Record<string, number>;
  }[],
  targetDate: Date,
  measurementType: string
): PredictionResult {
  const validMeasurements = measurements.filter(
    (m) => m.measurements[measurementType] !== undefined
  );

  if (validMeasurements.length < 2) {
    return {
      date: targetDate,
      value: validMeasurements[0]?.measurements[measurementType] || 0,
      confidence: 0,
    };
  }

  const data = validMeasurements.map((m) => ({
    date: new Date(m.date),
    value: m.measurements[measurementType],
  }));

  const { slope, intercept, r2 } = linearRegression(data);
  const predictedValue = slope * targetDate.getTime() + intercept;
  const confidence = Math.max(0, Math.min(1, r2));

  return {
    date: targetDate,
    value: Math.max(0, predictedValue),
    confidence,
  };
}

export function predictProgress(
  currentWeight: number,
  goal: string,
  weeks: number,
  weeklyRate?: number
): { predictedWeight: number; projectedDate: Date } {
  const rate = weeklyRate || (goal === "LOSE_WEIGHT" ? -0.5 : 0.5);
  const predictedWeight = currentWeight + rate * weeks;
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + weeks * 7);

  return {
    predictedWeight: Math.max(0, predictedWeight),
    projectedDate,
  };
}