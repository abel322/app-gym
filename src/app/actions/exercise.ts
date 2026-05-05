"use server";

import prisma from "@/lib/prisma";

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
    // Aquí simularemos la llamada a una IA o usaremos un endpoint real de IA que tengas configurado.
    // Como no tenemos una API Key de OpenAI/Gemini expuesta, hacemos el placeholder estructurado
    // para la integración real.
    
    // Generación de nombre en español y descripción técnica
    const translatedName = query.charAt(0).toUpperCase() + query.slice(1) + " (Generado por IA)";
    const technicalDescription = `Ejercicio enfocado en desarrollar fuerza y masa muscular. Técnica: Mantener la postura correcta, controlar la fase excéntrica y concéntrica.`;
    
    // Búsqueda de URL de imagen real (usando un servicio público de imágenes como Unsplash Source o un placeholder de fitness)
    // Usaremos un identificador único para evitar caché
    const randomSeed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop&q=80&seed=${randomSeed}`;
    
    // Determinar grupo muscular (simplificado, IA real lo clasificaría)
    const muscleGroup = "full body";

    // 3. Guardar en Neon
    const newExercise = await prisma.exercise.create({
      data: {
        id: `ai-${Date.now()}`,
        name: translatedName,
        muscleGroup: muscleGroup,
        imageUrl: imageUrl,
        // Si tienes campo description en tu schema, lo puedes añadir aquí
      },
    });

    return newExercise;
  } catch (error) {
    console.error("Error en searchOrGenerateExercise:", error);
    throw new Error("No se pudo generar el ejercicio. Intenta de nuevo.");
  }
}
