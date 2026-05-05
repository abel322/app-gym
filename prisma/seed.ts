import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const muscleTranslations: Record<string, string> = {
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

const commonTerms: Record<string, string> = {
  'Barbell': 'Barra',
  'Dumbbell': 'Mancuerna',
  'Cable': 'Polea',
  'Machine': 'Máquina',
  'Assisted': 'Asistido',
  'Band': 'Banda',
  'Press': 'Empuje',
  'Squat': 'Sentadilla',
  'Curl': 'Curl',
  'Extension': 'Extensión',
  'Fly': 'Apertura'
};

async function main() {
  console.log("🚀 Iniciando sembrado de base de datos...");
  console.log("🧹 Limpiando la base de datos...");
  await prisma.exercise.deleteMany({});
  
  const apiKey = process.env.EXERCISE_DB_API_KEY;

  if (!apiKey) {
    throw new Error("❌ No se encontró EXERCISE_DB_API_KEY en el archivo .env");
  }

  const apiExercises = [];
  let offset = 0;
  const limit = 10;
  
  while (true) {
    console.log(`Descargando bloque de ExerciseDB con offset=${offset}...`);
    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error(`❌ Error en la petición: ${response.statusText}`);
      break;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;

    apiExercises.push(...data);
    if (data.length < limit) break;
    offset += data.length;
    
    if (apiExercises.length > 2000) break;

    // Esperar 800ms para evitar el Rate Limit (Too Many Requests) de RapidAPI
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log(`📦 Recibidos ${apiExercises.length} ejercicios de la API.`);

  const seenNames = new Set();
  const exercises = [];

  for (const ex of apiExercises) {
    let translatedName = ex.name;
    Object.entries(commonTerms).forEach(([eng, esp]) => {
      translatedName = translatedName.replace(new RegExp(eng, 'gi'), esp);
    });

    const finalName = translatedName.charAt(0).toUpperCase() + translatedName.slice(1);
    const nameLower = finalName.toLowerCase();

    if (!seenNames.has(nameLower)) {
      seenNames.add(nameLower);
      exercises.push({
        name: finalName,
        description: `Ejercicio para ${muscleTranslations[ex.bodyPart] || ex.bodyPart} usando ${ex.equipment}.`,
        muscleGroup: muscleTranslations[ex.bodyPart] || ex.bodyPart,
        equipment: ex.equipment,
        // ExerciseDB ya no devuelve gifUrl, hay que construir la URL del endpoint de imágenes:
        imageUrl: ex.gifUrl || `https://exercisedb.p.rapidapi.com/image?exerciseId=${ex.id}&resolution=180&rapidapi-key=${apiKey}`,
      });
    }
  }

  console.log("Ejemplo de primer ejercicio:", exercises[0]);

  // Insertar en Neon (Usamos createMany para que sea veloz)
  await prisma.exercise.createMany({
    data: exercises,
    skipDuplicates: true,
  });

  console.log("✅ ¡Base de datos de Neon poblada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });