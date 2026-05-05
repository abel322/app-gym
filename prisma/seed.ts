import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// IMPORTANTE: COLOCA TU API KEY DE RAPIDAPI EN TU ARCHIVO .env
// COMO: EXERCISE_DB_API_KEY="TU_CLAVE"
// ============================================================================
const RAPIDAPI_KEY = process.env.EXERCISE_DB_API_KEY;

async function main() {
  console.log("Iniciando seed de base de datos...");
  
  // Limpieza Total
  console.log("Limpiando tabla de ejercicios para nueva carga...");
  await prisma.exercise.deleteMany({});

  if (!RAPIDAPI_KEY) {
    console.warn("⚠️ Advertencia: No has configurado tu EXERCISE_DB_API_KEY en el .env.");
    console.log("Por favor añade tu clave para importar los +1300 ejercicios.");
    return;
  }

  try {
    console.log("Descargando biblioteca masiva desde ExerciseDB...");

    // Verificación de Headers (Debug)
    const headers = {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    };
    
    console.log("Headers enviados:", {
      ...headers,
      "x-rapidapi-key": headers["x-rapidapi-key"]?.substring(0, 5) + "..." // Mascarada por seguridad
    });

    const apiExercises = [];
    let offset = 0;
    const limit = 10; // Forzar bloques pequeños para probar paginación activa
    
    while (true) {
      console.log(`Llamando a ExerciseDB con offset=${offset}...`);
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        console.error(`Error en la petición: ${response.status} ${response.statusText}`);
        break;
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.log("No se recibieron más ejercicios o la respuesta no es un array.");
        break;
      }

      apiExercises.push(...data);
      console.log(`Progreso: ${apiExercises.length} ejercicios obtenidos hasta ahora.`);

      // Si recibimos menos de lo que pedimos, es que ya no hay más
      if (data.length < limit) break;
      
      offset += data.length;
      
      // Seguridad: No entrar en bucle infinito si algo va mal
      if (apiExercises.length > 2000) break;
    }

    console.log(`Total final detectado: ${apiExercises.length} ejercicios.`);

    // Para evitar duplicados y errores (ya que 'name' puede no ser @unique en schema),
    // obtenemos los nombres que ya existen en la base de datos Neon.
    const existing = await prisma.exercise.findMany({ select: { name: true } });
    const existingNames = new Set(existing.map((e) => e.name.toLowerCase()));

    const newExercises = [];

    const muscleGroupMap: Record<string, string> = {
      'back': 'Espalda',
      'cardio': 'Cardio',
      'chest': 'Pecho',
      'lower arms': 'Antebrazos',
      'lower legs': 'Pantorrillas',
      'neck': 'Cuello',
      'shoulders': 'Hombros',
      'upper arms': 'Brazos',
      'upper legs': 'Piernas',
      'waist': 'Cintura/Core'
    };

    for (const ex of apiExercises) {
      const nameLower = ex.name.toLowerCase();

      if (!existingNames.has(nameLower)) {
        // Capitalizar el nombre para mejor presentación
        const capitalizedName = ex.name.charAt(0).toUpperCase() + ex.name.slice(1);
        
        // Traducción básica de nombre
        const translatedName = capitalizedName
          .replace(/Barbell/ig, 'Barra')
          .replace(/Dumbbell/ig, 'Mancuerna')
          .replace(/Assisted/ig, 'Asistido')
          .replace(/Band/ig, 'Banda')
          .replace(/Cable/ig, 'Polea')
          .replace(/Smith/ig, 'Máquina Smith')
          .replace(/Machine/ig, 'Máquina')
          .replace(/Press/ig, 'Empuje')
          .replace(/Fly/ig, 'Apertura');

        // Mapeo de campos solicitado con traducción de músculo
        newExercises.push({
          name: translatedName,
          muscleGroup: muscleGroupMap[ex.bodyPart.toLowerCase()] || ex.bodyPart, // Traducción o fallback
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
