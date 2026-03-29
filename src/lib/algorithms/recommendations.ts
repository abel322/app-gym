interface UserData {
  weight: number;
  height: number;
  goal: string;
  activityLevel: string;
  age?: number;
  gender?: string;
}

interface Recommendation {
  type: "workout" | "nutrition" | "measurement" | "general";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export function generateRecommendations(userData: UserData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { weight, height, goal, activityLevel, age, gender } = userData;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // BMI-based recommendations
  if (bmi < 18.5) {
    recommendations.push({
      type: "nutrition",
      title: "Aumentar ingestión calórica",
      description:
        "Tu BMI indica bajo peso. Considera aumentar tu ingestión calórica con alimentos nutritivos.",
      priority: "high",
    });
  } else if (bmi >= 25 && bmi < 30) {
    recommendations.push({
      type: "nutrition",
      title: "Reducir calorías ligeramente",
      description:
        "Tu BMI indica sobrepeso. Considera crear un pequeño déficit calórico.",
      priority: "high",
    });
  } else if (bmi >= 30) {
    recommendations.push({
      type: "nutrition",
      title: "Crear déficit calórico",
      description:
        "Tu BMI indica obesidad. Es importante crear un déficit calórico sostenido.",
      priority: "high",
    });
  }

  // Goal-based recommendations
  switch (goal) {
    case "LOSE_WEIGHT":
      recommendations.push({
        type: "nutrition",
        title: "Déficit calórico moderado",
        description:
          "Para perder peso, crea un déficit de 300-500 calorías diario.",
        priority: "high",
      });
      recommendations.push({
        type: "workout",
        title: "Entrenamiento de cardio",
        description:
          "Incluye 3-4 sesiones de cardio semanal para maximizar la quema de grasa.",
        priority: "medium",
      });
      break;
    case "GAIN_MUSCLE":
      recommendations.push({
        type: "nutrition",
        title: "Superávit calórico",
        description:
          "Para ganar músculo, necesitas un exceso calórico de 200-300 calorías diario.",
        priority: "high",
      });
      recommendations.push({
        type: "workout",
        title: "Entrenamiento de fuerza",
        description:
          "Enfócate en ejercicios compuestos con pesas y come suficiente proteína.",
        priority: "medium",
      });
      break;
    case "RECOMPOSITION":
      recommendations.push({
        type: "nutrition",
        title: "Balance calórico",
        description:
          "Mantén tus calorías cerca del mantenimiento con alta proteína.",
        priority: "high",
      });
      recommendations.push({
        type: "workout",
        title: "Entrenamiento híbrido",
        description:
          "Combina entrenamiento de fuerza con HIIT para optimizar la recomposición.",
        priority: "medium",
      });
      break;
  }

  // Activity level recommendations
  switch (activityLevel) {
    case "SEDENTARY":
      recommendations.push({
        type: "general",
        title: "Aumentar actividad física",
        description:
          "Comienza con caminatas diarias de 30 minutos y aumenta gradualmente.",
        priority: "high",
      });
      break;
    case "LIGHTLY_ACTIVE":
      recommendations.push({
        type: "workout",
        title: "Establecer rutina de ejercicios",
        description:
          "Considera añadir 2-3 sesiones de entrenamiento estructurado por semana.",
        priority: "medium",
      });
      break;
    case "VERY_ACTIVE":
    case "EXTRA_ACTIVE":
      recommendations.push({
        type: "nutrition",
        title: "Incrementar calorías",
        description:
          "Con tu nivel de actividad, asegúrate de consumir suficientes calorías para recuperarte.",
        priority: "medium",
      });
      break;
  }

  // Age-based recommendations
  if (age && age > 40) {
    recommendations.push({
      type: "workout",
      title: "Incluir entrenamiento de movilidad",
      description:
        "A esta edad, el entrenamiento de movilidad y flexibilidad es crucial.",
      priority: "medium",
    });
  }

  // Gender-based recommendations
  if (gender === "FEMALE" && goal === "GAIN_MUSCLE") {
    recommendations.push({
      type: "nutrition",
      title: "Proteína adecuada para mujeres",
      description:
        "Las mujeres pueden necesitar ligeramente menos proteína que los hombres para el crecimiento muscular.",
      priority: "low",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return recommendations;
}

export function analyzeProgress(
  measurements: { date: Date; weight: number }[],
  goal: string
): {
  trend: "improving" | "stable" | "declining";
  weeklyChange: number;
  message: string;
} {
  if (measurements.length < 2) {
    return {
      trend: "stable",
      weeklyChange: 0,
      message: "Se necesitan más datos para analizar el progreso",
    };
  }

  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sortedMeasurements[0];
  const last = sortedMeasurements[sortedMeasurements.length - 1];
  const daysDiff =
    (new Date(last.date).getTime() - new Date(first.date).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysDiff === 0) {
    return { trend: "stable", weeklyChange: 0, message: "Sin cambios registrados" };
  }

  const weeklyChange = ((last.weight - first.weight) / daysDiff) * 7;

  let trend: "improving" | "stable" | "declining";
  let message: string;

  if (goal === "LOSE_WEIGHT") {
    if (weeklyChange < -0.5) {
      trend = "improving";
      message = "Excelente progreso en la pérdida de peso";
    } else if (weeklyChange > 0.5) {
      trend = "declining";
      message = "El peso está aumentando, considera ajustar tu plan";
    } else {
      trend = "stable";
      message = "El peso se mantiene estable";
    }
  } else if (goal === "GAIN_MUSCLE") {
    if (weeklyChange > 0.3) {
      trend = "improving";
      message = "Buen progreso en el aumento de masa muscular";
    } else if (weeklyChange < -0.3) {
      trend = "declining";
      message = "El peso está disminuyendo, considera aumentar calorías";
    } else {
      trend = "stable";
      message = "El peso se mantiene estable";
    }
  } else {
    if (Math.abs(weeklyChange) < 0.5) {
      trend = "improving";
      message = "Excelente mantenimiento del peso";
    } else {
      trend = "declining";
      message = "Hay variaciones significativas en el peso";
    }
  }

  return { trend, weeklyChange, message };
}