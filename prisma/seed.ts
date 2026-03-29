import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create exercises
  const exercises = [
    // Chest
    {
      name: "Press de Banca",
      description: "Ejercicio compuesto para pecho, hombros y tríceps",
      muscleGroup: "Pecho",
      equipment: "Barra",
    },
    {
      name: "Press Inclinado con Mancuernas",
      description: "Trabaja la parte superior del pecho",
      muscleGroup: "Pecho",
      equipment: "Mancuernas",
    },
    {
      name: "Aperturas con Mancuernas",
      description: "Aislamiento del pecho",
      muscleGroup: "Pecho",
      equipment: "Mancuernas",
    },
    {
      name: "Fondos en Paralelas",
      description: "Ejercicio de peso corporal para pecho y tríceps",
      muscleGroup: "Pecho",
      equipment: "Peso corporal",
    },

    // Back
    {
      name: "Dominadas",
      description: "Ejercicio compuesto para espalda y bíceps",
      muscleGroup: "Espalda",
      equipment: "Peso corporal",
    },
    {
      name: "Remo con Barra",
      description: "Ejercicio compuesto para espalda media",
      muscleGroup: "Espalda",
      equipment: "Barra",
    },
    {
      name: "Peso Muerto",
      description: "Ejercicio compuesto para espalda baja y piernas",
      muscleGroup: "Espalda",
      equipment: "Barra",
    },
    {
      name: "Remo con Mancuerna",
      description: "Aislamiento unilateral de espalda",
      muscleGroup: "Espalda",
      equipment: "Mancuernas",
    },

    // Legs
    {
      name: "Sentadilla",
      description: "Ejercicio compuesto para piernas",
      muscleGroup: "Piernas",
      equipment: "Barra",
    },
    {
      name: "Prensa de Piernas",
      description: "Ejercicio para cuádriceps y glúteos",
      muscleGroup: "Piernas",
      equipment: "Máquina",
    },
    {
      name: "Zancadas",
      description: "Ejercicio unilateral para piernas",
      muscleGroup: "Piernas",
      equipment: "Mancuernas",
    },
    {
      name: "Curl Femoral",
      description: "Aislamiento de isquiotibiales",
      muscleGroup: "Piernas",
      equipment: "Máquina",
    },
    {
      name: "Elevación de Gemelos",
      description: "Aislamiento de pantorrillas",
      muscleGroup: "Piernas",
      equipment: "Máquina",
    },

    // Shoulders
    {
      name: "Press Militar",
      description: "Ejercicio compuesto para hombros",
      muscleGroup: "Hombros",
      equipment: "Barra",
    },
    {
      name: "Elevaciones Laterales",
      description: "Aislamiento de deltoides laterales",
      muscleGroup: "Hombros",
      equipment: "Mancuernas",
    },
    {
      name: "Elevaciones Frontales",
      description: "Aislamiento de deltoides frontales",
      muscleGroup: "Hombros",
      equipment: "Mancuernas",
    },
    {
      name: "Pájaros",
      description: "Aislamiento de deltoides posteriores",
      muscleGroup: "Hombros",
      equipment: "Mancuernas",
    },

    // Arms
    {
      name: "Curl con Barra",
      description: "Ejercicio básico para bíceps",
      muscleGroup: "Bíceps",
      equipment: "Barra",
    },
    {
      name: "Curl con Mancuernas",
      description: "Ejercicio para bíceps con mayor rango",
      muscleGroup: "Bíceps",
      equipment: "Mancuernas",
    },
    {
      name: "Curl Martillo",
      description: "Trabaja bíceps y braquial",
      muscleGroup: "Bíceps",
      equipment: "Mancuernas",
    },
    {
      name: "Press Francés",
      description: "Aislamiento de tríceps",
      muscleGroup: "Tríceps",
      equipment: "Barra",
    },
    {
      name: "Extensiones de Tríceps",
      description: "Aislamiento de tríceps",
      muscleGroup: "Tríceps",
      equipment: "Mancuernas",
    },
    {
      name: "Fondos para Tríceps",
      description: "Ejercicio de peso corporal para tríceps",
      muscleGroup: "Tríceps",
      equipment: "Peso corporal",
    },

    // Core
    {
      name: "Plancha",
      description: "Ejercicio isométrico para core",
      muscleGroup: "Abdomen",
      equipment: "Peso corporal",
    },
    {
      name: "Crunches",
      description: "Ejercicio básico para abdominales",
      muscleGroup: "Abdomen",
      equipment: "Peso corporal",
    },
    {
      name: "Elevación de Piernas",
      description: "Trabaja abdomen inferior",
      muscleGroup: "Abdomen",
      equipment: "Peso corporal",
    },
    {
      name: "Russian Twist",
      description: "Trabaja oblicuos",
      muscleGroup: "Abdomen",
      equipment: "Peso corporal",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
