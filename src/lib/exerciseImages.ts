/**
 * Utility to map fitness exercise names and muscle groups to high-quality,
 * responsive, and relevant images from Unsplash, avoiding retired/broken APIs.
 */

const EXERCISE_KEYWORD_IMAGES: Record<string, string> = {
  // Chest / Pecho
  "press de banca": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "bench press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "pecho": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "chest": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "aperturas": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "fly": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "push up": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "flexiones": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "fondos": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "dip": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",

  // Legs / Piernas
  "sentadilla": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "squat": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "prensa": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  "leg press": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  "zancadas": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "lunge": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "aductores": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "abductores": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "adductor": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "abductor": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "femoral": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "isquios": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "cuadriceps": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "quads": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "pantorrilla": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "calf": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "pierna": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",

  // Back / Espalda
  "dominadas": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "pullup": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "chin up": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "remo": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "row": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "jalon": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "lat pulldown": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "espalda": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "back": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",

  // Arms / Brazos
  "biceps": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "bicep": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "curl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "triceps": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&q=80",
  "tricep": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&q=80",
  "extension": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&q=80",
  "brazo": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "arm": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",

  // Shoulders / Hombros
  "press militar": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "military press": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "hombro": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "shoulder": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "elevaciones": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "lateral raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",

  // Deadlift / Peso muerto
  "peso muerto": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  "deadlift": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",

  // Core / Abs
  "abdominal": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "abs": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "plank": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "plancha": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "crunches": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "core": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",

  // Cardio
  "cardio": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  "correr": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  "run": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80"
};

const MUSCLE_GROUP_IMAGES: Record<string, string> = {
  "pecho": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "chest": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  
  "piernas": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "legs": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "upper legs": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
  "lower legs": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "pantorrillas": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  
  "espalda": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  "back": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
  
  "brazos": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "arms": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "upper arms": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "lower arms": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&q=80",
  "antebrazos": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&q=80",
  
  "hombros": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  "shoulders": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
  
  "cintura/core": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "waist": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "core": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  
  "cardio": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  "neck": "https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=400&q=80",
  "cuello": "https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=400&q=80",
  "full body": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80";

export function getExerciseImage(
  name: string,
  muscleGroup?: string | null,
  imageUrl?: string | null
): string {
  // If the image URL is valid, non-empty, and NOT using the retired source.unsplash.com API
  if (
    imageUrl &&
    typeof imageUrl === "string" &&
    imageUrl.trim().length > 0 &&
    !imageUrl.includes("source.unsplash.com")
  ) {
    return imageUrl;
  }

  // Normalize name
  const normalizedName = name.toLowerCase();

  // 1. Try keyword matching
  for (const [keyword, imgUrl] of Object.entries(EXERCISE_KEYWORD_IMAGES)) {
    if (normalizedName.includes(keyword)) {
      return imgUrl;
    }
  }

  // 2. Try muscle group matching
  if (muscleGroup) {
    const normalizedMuscle = muscleGroup.toLowerCase();
    if (MUSCLE_GROUP_IMAGES[normalizedMuscle]) {
      return MUSCLE_GROUP_IMAGES[normalizedMuscle];
    }
    // Substring match on muscle group
    for (const [group, imgUrl] of Object.entries(MUSCLE_GROUP_IMAGES)) {
      if (normalizedMuscle.includes(group) || group.includes(normalizedMuscle)) {
        return imgUrl;
      }
    }
  }

  // 3. Absolute fallback
  return DEFAULT_IMAGE;
}
