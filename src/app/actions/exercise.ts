"use server";

import prisma from "@/lib/prisma";
import { getExerciseImage } from "@/lib/exerciseImages";


export async function searchOrGenerateExercise(query: string) {
  if (!query || query.trim().length === 0) {
    throw new Error("La búsqueda no puede estar vacía.");
  }

  try {
    // 1. Buscar en la base de datos de Neon
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    if (existingExercise) {
      return existingExercise;
    }

    // 2. Si no existe, "Generar con IA" y buscar imagen
    // Diccionario simple para la traducción de términos al inglés (simulando IA)
    const generateEnglishQuery = (text: string): string => {
      const dictionary: Record<string, string> = {
        sentadilla: "squat", sentadillas: "squats", tripse: "triceps", triceps: "triceps",
        mancuerna: "dumbbell", mancuernas: "dumbbells", barra: "barbell", pecho: "chest",
        espalda: "back", hombros: "shoulders", hombro: "shoulder", piernas: "legs",
        pierna: "leg", biceps: "biceps", bicep: "bicep", flexiones: "push up",
        dominadas: "pull up", peso: "weight", muerto: "deadlift"
      };
      let translated = text.toLowerCase();
      for (const [es, en] of Object.entries(dictionary)) {
        translated = translated.replace(new RegExp(`\\b${es}\\b`, 'g'), en);
      }
      return `${translated} correct technique form`;
    };

    // Generación de nombre en español y descripción técnica
    const translatedName = query.charAt(0).toUpperCase() + query.slice(1);
    const technicalDescription = `Ejercicio enfocado en desarrollar fuerza y masa muscular para ${query}. Técnica: Mantener la postura correcta y el control del movimiento en todo momento.`;
    
    // Búsqueda de URL de imagen real usando término específico
    const englishQuery = generateEnglishQuery(query);
    const urlQuery = encodeURIComponent(englishQuery.replace(/ /g, ','));
    
    // Fallback dinámico que siempre cambia basado en el nombre del ejercicio si Unsplash falla
    let imageUrl = `https://loremflickr.com/800/800/fitness,${urlQuery}/all?lock=${Date.now()}`;
    
    try {
      // Llamada a Unsplash (usando source que redirige a una URL única de la foto real)
      const res = await fetch(`https://source.unsplash.com/featured/800x800/?workout,${encodeURIComponent(englishQuery)}`, {
        redirect: "follow",
        cache: "no-store",
      });
      
      if (res.ok && res.url && !res.url.includes("source.unsplash.com")) {
        imageUrl = res.url; // Obtenemos la URL real persistente de Unsplash
      }
    } catch (err) {
      console.error("Error obteniendo imagen desde Unsplash:", err);
    }

    // Log de Depuración solicitado
    console.log("Consulta de imagen para:", translatedName, "-> Consulta de imagen:", englishQuery, "-> URL encontrada:", imageUrl);

    // Determinar grupo muscular (simplificado, IA real lo clasificaría)
    const muscleGroup = "full body";

    // Resolve dynamic image URL using helper
    const finalImageUrl = getExerciseImage(translatedName, muscleGroup, imageUrl);

    // 3. Guardar en Neon
    const newExercise = await prisma.exercise.create({
      data: {
        id: `ai-${Date.now()}`,
        name: translatedName,
        muscleGroup: muscleGroup,
        imageUrl: finalImageUrl,
        description: technicalDescription,
      },
    });

    return newExercise;
  } catch (error) {
    console.error("Error en searchOrGenerateExercise:", error);
    throw new Error("No se pudo generar el ejercicio. Intenta de nuevo.");
  }
}
