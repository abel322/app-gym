import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// IMPORTANTE: COLOCA TU API KEY DE RAPIDAPI EN TU ARCHIVO .env
// COMO: EXERCISE_DB_API_KEY="TU_CLAVE"
// ============================================================================
const RAPIDAPI_KEY = process.env.EXERCISE_DB_API_KEY;

async function main() {
  console.log("Iniciando seed de base de datos...");

  if (!RAPIDAPI_KEY) {
    console.warn("⚠️ Advertencia: No has configurado tu EXERCISE_DB_API_KEY en el .env.");
    console.log("Por favor añade tu clave para importar los +1300 ejercicios.");
    return;
  }

  try {
    console.log("Descargando biblioteca masiva desde ExerciseDB...");
    
    // Obtenemos un límite grande para traer la mayoría de ejercicios
    const response = await fetch("https://exercisedb.p.rapidapi.com/exercises?limit=1500", {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API de RapidAPI: ${response.statusText}`);
    }

    const apiExercises = await response.json();
    console.log(`Se obtuvieron ${apiExercises.length} ejercicios de la API.`);

    // Para evitar duplicados y errores (ya que 'name' puede no ser @unique en schema),
    // obtenemos los nombres que ya existen en la base de datos Neon.
    const existing = await prisma.exercise.findMany({ select: { name: true } });
    const existingNames = new Set(existing.map((e) => e.name.toLowerCase()));

    const newExercises = [];

    for (const ex of apiExercises) {
      const nameLower = ex.name.toLowerCase();
      
      if (!existingNames.has(nameLower)) {
        // Capitalizar el nombre para mejor presentación
        const capitalizedName = ex.name.charAt(0).toUpperCase() + ex.name.slice(1);
        
        // Mapeo de campos solicitado
        newExercises.push({
          name: capitalizedName,
          muscleGroup: ex.bodyPart, // bodyPart -> muscleGroup
          equipment: ex.equipment,  // equipment -> equipment
          imageUrl: ex.gifUrl,      // gifUrl -> imageUrl
          description: `Objetivo: ${ex.target}`,
        });
        
        // Agregar al set para evitar duplicados en la misma respuesta de la API
        existingNames.add(nameLower);
      }
    }

    if (newExercises.length > 0) {
      console.log(`Insertando ${newExercises.length} nuevos ejercicios en Neon DB...`);
      
      // Usamos createMany para optimizar la inserción masiva en Postgres (Neon)
      await prisma.exercise.createMany({
        data: newExercises,
        skipDuplicates: true,
      });
      
      console.log("¡Sincronización masiva completada con éxito!");
    } else {
      console.log("La base de datos ya está actualizada. No hay ejercicios nuevos.");
    }

  } catch (error) {
    console.error("Error durante el proceso de Seed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
