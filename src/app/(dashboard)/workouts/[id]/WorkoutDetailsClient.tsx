"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Save, Plus, Trash2, Flame, Dumbbell, Sparkles, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { searchOrGenerateExercise } from "@/app/actions/exercise";
import { cn } from "@/lib/utils";
import { getExerciseImage } from "@/lib/exerciseImages";


const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const SHORT_DAYS: Record<string, string> = {
  'Lunes': 'LUN',
  'Martes': 'MAR',
  'Miércoles': 'MIÉ',
  'Jueves': 'JUE',
  'Viernes': 'VIE',
  'Sábado': 'SÁB',
  'Domingo': 'DOM'
};

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  imageUrl?: string | null;
  description?: string | null;
}

interface SetData {
  reps: string;
  weight: string;
}

interface LoggedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl?: string | null;
  description?: string | null;
  muscleGroup?: string | null;
  day: string;
  sets: SetData[];
}

interface WorkoutDetailsClientProps {
  initialWorkout: {
    id: string;
    name: string;
    description: string | null;
    difficulty: string;
    duration: number | null;
    exercises: Array<{
      id: string;
      workoutId: string;
      exerciseId: string;
      exercise: {
        id: string;
        name: string;
        description: string | null;
        muscleGroup: string;
        equipment: string | null;
        videoUrl: string | null;
        imageUrl: string | null;
      };
      order: number;
      sets: number;
      reps: number;
      restSeconds: number;
      weight: number | null;
      day: string | null;
    }>;
  };
  surplusTarget: number;
}

function ExerciseImage({ src, alt, className = "h-12 w-12" }: { src: string; alt: string; className?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`rounded-md bg-muted flex items-center justify-center shrink-0 ${className}`}>
        <Dumbbell className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        quality={75}
        className={`object-cover h-full w-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

const DEFAULT_REAL_EXERCISES: Exercise[] = [
  {
    id: "default-aductores",
    name: "Aductores",
    muscleGroup: "Piernas",
    imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
    description: "Ejercicio en máquina enfocado en desarrollar fuerza y estabilidad en aductores.",
  },
  {
    id: "default-biceps",
    name: "Biceps",
    muscleGroup: "Brazos",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
    description: "Flexión de brazos con mancuernas para concentrar el estímulo en el bíceps braquial.",
  },
  {
    id: "default-press-banca",
    name: "Press de Banca",
    muscleGroup: "Pecho",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    description: "Empuje horizontal con barra para desarrollar fuerza en pectorales, tríceps y deltoides anterior.",
  },
  {
    id: "default-sentadilla",
    name: "Sentadilla con Barra",
    muscleGroup: "Piernas",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
    description: "Ejercicio compuesto básico para potenciar cuádriceps, glúteos e isquiotibiales.",
  },
  {
    id: "default-dominadas",
    name: "Dominadas",
    muscleGroup: "Espalda",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80",
    description: "Tracción vertical con peso corporal ideal para trabajar el dorsal ancho y bíceps.",
  },
  {
    id: "default-peso-muerto",
    name: "Peso Muerto",
    muscleGroup: "Espalda",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
    description: "Levantamiento de barra desde el suelo que estimula toda la cadena posterior.",
  },
  {
    id: "default-prensa-pierna",
    name: "Prensa de Piernas",
    muscleGroup: "Piernas",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    description: "Empuje de piernas en máquina enfocado en aislar cuádriceps y glúteos de forma segura.",
  },
  {
    id: "default-press-militar",
    name: "Press Militar",
    muscleGroup: "Hombros",
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80",
    description: "Empuje vertical con barra por encima de la cabeza para deltoides y tríceps.",
  },
  {
    id: "default-fondos-paralelas",
    name: "Fondos en Paralelas",
    muscleGroup: "Pecho",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    description: "Flexo-extensión de brazos en barras paralelas para pecho inferior y tríceps.",
  },
  {
    id: "default-zancadas",
    name: "Zancadas con Mancuernas",
    muscleGroup: "Piernas",
    imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80",
    description: "Zancadas alternadas unilaterales para glúteos, cuádriceps y balance.",
  },
  {
    id: "default-elevaciones-laterales",
    name: "Elevaciones Laterales",
    muscleGroup: "Hombros",
    imageUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&q=80",
    description: "Aperturas laterales con mancuerna para aislar la cabeza lateral del deltoides.",
  },
  {
    id: "default-extensiones-triceps",
    name: "Extensiones de Tríceps",
    muscleGroup: "Brazos",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&q=80",
    description: "Extensión de brazos en polea para aislar tríceps.",
  },
  {
    id: "default-plancha",
    name: "Plancha Abdominal",
    muscleGroup: "Cintura/Core",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    description: "Isometría de abdomen para fortalecer el core.",
  }
];

function ExerciseCardCompact({ logEx, onClick, onDelete }: { logEx: LoggedExercise, onClick: () => void, onDelete: () => void }) {
  const reps = logEx.sets[0]?.reps || "10";
  const exercise = {
    name: logEx.exerciseName,
    exerciseName: logEx.exerciseName,
    muscleGroup: logEx.muscleGroup,
    category: logEx.muscleGroup,
    imageUrl: logEx.imageUrl,
  };

  return (
    <div 
      className="cursor-pointer hover:border-primary transition-all shadow-sm w-full p-2 bg-gray-50 dark:bg-zinc-950/40 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 rounded-lg flex items-center gap-2 group/card" 
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border relative">
        <Image 
          src={exercise.imageUrl || getExerciseImage(exercise.name)} 
          alt={exercise.name || exercise.exerciseName} 
          width={48} 
          height={48} 
          className="object-cover h-full w-full" 
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="font-semibold text-xs text-foreground leading-tight" title={exercise.name || exercise.exerciseName}>
          <span className="truncate max-w-[120px]">{exercise.name || exercise.exerciseName}</span>
        </span>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">
            {logEx.sets.length}S {reps && `× ${reps}R`}
          </span>
          {(exercise.muscleGroup || exercise.category || 'General') && (
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/30 px-1.5 py-0.5 rounded-md capitalize shrink-0 truncate max-w-[80px]">
              {exercise.muscleGroup || exercise.category || 'General'}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-muted opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0 ml-0.5"
        title="Eliminar ejercicio"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function WorkoutDetailsClient({ initialWorkout, surplusTarget }: WorkoutDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");

  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() => {
    // Determine the initial Monday date
    const curr = new Date();
    const day = curr.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const initialMonday = new Date(curr);
    initialMonday.setDate(diffToMonday);
    initialMonday.setHours(0, 0, 0, 0);

    return initialWorkout.exercises.map((ex) => {
      const setsArray = [];
      for (let i = 0; i < ex.sets; i++) {
        setsArray.push({
          reps: ex.reps.toString(),
          weight: (ex.weight ?? 0).toString()
        });
      }

      // Map legacy day names (Lunes, Martes) to dates of the initial week
      let dayVal = ex.day || "Lunes";
      if (DIAS_SEMANA.includes(dayVal)) {
        const dayIndex = DIAS_SEMANA.indexOf(dayVal);
        const dateOfCurrentWeek = new Date(initialMonday);
        dateOfCurrentWeek.setDate(initialMonday.getDate() + dayIndex);
        const yyyy = dateOfCurrentWeek.getFullYear();
        const mm = String(dateOfCurrentWeek.getMonth() + 1).padStart(2, '0');
        const dd = String(dateOfCurrentWeek.getDate()).padStart(2, '0');
        dayVal = `${yyyy}-${mm}-${dd}`;
      }

      return {
        id: ex.id,
        exerciseId: ex.exerciseId,
        exerciseName: ex.exercise.name,
        imageUrl: ex.exercise.imageUrl || undefined,
        description: ex.exercise.description || undefined,
        muscleGroup: ex.exercise.muscleGroup || undefined,
        day: dayVal,
        sets: setsArray
      };
    });
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<string | null>(null);

  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [copyDaySource, setCopyDaySource] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Week Navigation State
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const curr = new Date();
    const day = curr.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr);
    monday.setDate(diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const getWeekDates = (startDate: Date) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + i);
      const yyyy = nextDay.getFullYear();
      const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDay.getDate()).padStart(2, '0');
      week.push({
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayName: days[i],
        dateObj: nextDay
      });
    }
    return week;
  };

  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  const prevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch exercises list
  useEffect(() => {
    setIsLoadingExercises(true);
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const dbNames = new Set(data.map(e => e.name.toLowerCase()));
          const combined = [
            ...data,
            ...DEFAULT_REAL_EXERCISES.filter(de => !dbNames.has(de.name.toLowerCase()))
          ];
          const enriched = combined.map(e => {
            const cleanName = e.name.replace(/\s*\(Generado por IA\)/gi, '').trim();
            return {
              ...e,
              name: cleanName,
              imageUrl: getExerciseImage(cleanName, e.muscleGroup, e.imageUrl)
            };
          });
          setExercises(enriched);
        } else {
          setExercises(DEFAULT_REAL_EXERCISES.map(e => {
            const cleanName = e.name.replace(/\s*\(Generado por IA\)/gi, '').trim();
            return {
              ...e,
              name: cleanName,
              imageUrl: getExerciseImage(cleanName, e.muscleGroup, e.imageUrl)
            };
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching exercises", err);
        setExercises(DEFAULT_REAL_EXERCISES.map(e => {
          const cleanName = e.name.replace(/\s*\(Generado por IA\)/gi, '').trim();
          return {
            ...e,
            name: cleanName,
            imageUrl: getExerciseImage(cleanName, e.muscleGroup, e.imageUrl)
          };
        }));
      })
      .finally(() => setIsLoadingExercises(false));
  }, []);

  // Fetch/reload workouts for the selected week
  useEffect(() => {
    if (!initialWorkout.id) return;
    
    const fetchWorkoutForWeek = async () => {
      try {
        const res = await fetch(`/api/workouts/${initialWorkout.id}`);
        if (!res.ok) throw new Error("Fallo al obtener entrenamientos");
        const data = await res.json();
        if (data && Array.isArray(data.exercises)) {
          // Map database exercises to LoggedExercises format
          const mapped = data.exercises.map((ex: any) => {
            const setsArray = [];
            for (let i = 0; i < ex.sets; i++) {
              setsArray.push({
                reps: ex.reps.toString(),
                weight: (ex.weight ?? 0).toString()
              });
            }
            
            // Map legacy day names (Lunes, Martes) to dates of the current week start
            let dayVal = ex.day || "Lunes";
            if (DIAS_SEMANA.includes(dayVal)) {
              const dayIndex = DIAS_SEMANA.indexOf(dayVal);
              const dateOfCurrentWeek = new Date(currentWeekStart);
              dateOfCurrentWeek.setDate(currentWeekStart.getDate() + dayIndex);
              const yyyy = dateOfCurrentWeek.getFullYear();
              const mm = String(dateOfCurrentWeek.getMonth() + 1).padStart(2, '0');
              const dd = String(dateOfCurrentWeek.getDate()).padStart(2, '0');
              dayVal = `${yyyy}-${mm}-${dd}`;
            }

            const cleanExName = ex.exercise.name.replace(/\s*\(Generado por IA\)/gi, '').trim();
            return {
              id: ex.id,
              exerciseId: ex.exerciseId,
              exerciseName: cleanExName,
              imageUrl: getExerciseImage(cleanExName, ex.exercise.muscleGroup, ex.exercise.imageUrl),
              description: ex.exercise.description || undefined,
              muscleGroup: ex.exercise.muscleGroup || undefined,
              day: dayVal,
              sets: setsArray
            };
          });
          setLoggedExercises(mapped);
        }
      } catch (err) {
        console.error("Error reloading workout week details:", err);
      }
    };

    fetchWorkoutForWeek();
  }, [currentWeekStart, initialWorkout.id]);

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "all" || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = Array.from(new Set(exercises.map((ex) => ex.muscleGroup))).sort();

  const todayIndex = new Date().getDay();
  const currentDayName = todayIndex === 0 ? 'Domingo' : DIAS_SEMANA[todayIndex - 1];

  const addExercise = (exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!ex || !selectedDayForAdd) return;
    
    const newId = Math.random().toString(36).substr(2, 9);
    setLoggedExercises([
      ...loggedExercises,
      {
        id: newId,
        exerciseId,
        exerciseName: ex.name,
        imageUrl: ex.imageUrl,
        description: ex.description,
        muscleGroup: ex.muscleGroup,
        day: selectedDayForAdd,
        sets: [{ reps: "", weight: "" }],
      },
    ]);
    setIsExerciseDialogOpen(false);
    setTimeout(() => setEditingExerciseId(newId), 150);
  };

  const handleAIGenerate = async () => {
    if (!searchQuery || !selectedDayForAdd) return;
    setIsGenerating(true);
    try {
      const newEx = await searchOrGenerateExercise(searchQuery);
      if (!exercises.find(e => e.id === newEx.id)) {
        setExercises(prev => [...prev, newEx]);
      }
      
      const newId = Math.random().toString(36).substr(2, 9);
      setLoggedExercises(prev => [
        ...prev,
        {
          id: newId,
          exerciseId: newEx.id,
          exerciseName: newEx.name,
          imageUrl: newEx.imageUrl,
          description: newEx.description,
          muscleGroup: newEx.muscleGroup,
          day: selectedDayForAdd,
          sets: [{ reps: "", weight: "" }],
        },
      ]);
      setIsExerciseDialogOpen(false);
      toast({ title: "¡Ejercicio generado!", description: "Se ha añadido usando IA." });
      setTimeout(() => setEditingExerciseId(newId), 150);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo generar el ejercicio con IA.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const removeExercise = (id: string) => {
    setLoggedExercises(loggedExercises.filter((e) => e.id !== id));
  };

  const addSet = (exerciseId: string) => {
    setLoggedExercises(
      loggedExercises.map((e) => {
        if (e.id === exerciseId) {
          const lastSet = e.sets[e.sets.length - 1];
          return { ...e, sets: [...e.sets, { reps: lastSet?.reps || "", weight: lastSet?.weight || "" }] };
        }
        return e;
      })
    );
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setLoggedExercises(
      loggedExercises.map((e) => {
        if (e.id === exerciseId) {
          const newSets = [...e.sets];
          newSets.splice(setIndex, 1);
          return { ...e, sets: newSets };
        }
        return e;
      })
    );
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof SetData, value: string) => {
    setLoggedExercises(
      loggedExercises.map((e) => {
        if (e.id === exerciseId) {
          const newSets = [...e.sets];
          newSets[setIndex][field] = value;
          return { ...e, sets: newSets };
        }
        return e;
      })
    );
  };

  const handleSave = async () => {
    if (loggedExercises.length === 0) {
      toast({ title: "Semana vacía", description: "Agrega al menos un ejercicio.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const byDay = loggedExercises.reduce((acc, ex) => {
        if (!acc[ex.day]) acc[ex.day] = [];
        acc[ex.day].push(ex);
        return acc;
      }, {} as Record<string, LoggedExercise[]>);

      const weekExercises = Object.entries(byDay).map(([dayName, exList]) => {
         return {
            dayName,
            exercises: exList.map((ex) => ({
               exerciseId: ex.exerciseId,
               exerciseName: ex.exerciseName,
               muscleGroup: ex.muscleGroup,
               imageUrl: ex.imageUrl,
               description: ex.description,
               sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight }))
            }))
         };
      });

      const response = await fetch(`/api/workouts/${initialWorkout.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: initialWorkout.name,
          description: initialWorkout.description,
          difficulty: initialWorkout.difficulty,
          duration: initialWorkout.duration,
          weekExercises,
        }),
      });
      
      if (!response.ok) throw new Error("Fallo al guardar el cronograma");

      toast({
        title: "¡Semana Guardada!",
        description: "Tu cronograma semanal ha sido actualizado correctamente.",
      });
      router.push("/workouts");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un problema al guardar el cronograma.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const editingExercise = loggedExercises.find(e => e.id === editingExerciseId);

  return (
    <DashboardLayout
      title=""
      description=""
    >
      <div className="space-y-4 pb-4">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between w-full mb-4 border-b pb-3 border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => router.push("/workouts")} className="h-8 w-8 p-0 hover:bg-muted/50 rounded-xl">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-tight">
                {initialWorkout.name}
              </h1>
              {surplusTarget && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <Flame className="h-3 w-3 text-orange-600" />
                  Meta: {surplusTarget} kcal
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Week navigation (compact inline control) */}
            <div className="flex items-center gap-2 bg-transparent py-1">
              <Button type="button" variant="outline" size="icon" onClick={prevWeek} className="h-7 w-7 rounded-lg">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isMounted ? currentWeekStart.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' }) : ""} - {isMounted ? currentWeekEnd.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' }) : ""}
              </div>
              <Button type="button" variant="outline" size="icon" onClick={nextWeek} className="h-7 w-7 rounded-lg">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button 
              type="button"
              className="bg-gradient-primary text-white font-semibold text-xs px-4 py-2 shadow-sm hover:shadow-md transition-all rounded-lg"
              onClick={handleSave}
              disabled={isSaving || loggedExercises.length === 0}
            >
              <Save className="h-3.5 w-3.5 mr-1 inline-block" />
              {isSaving ? "Guardando..." : "Guardar Semana"}
            </Button>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full items-start">
          {weekDates.map(({ dateStr, dayName, dateObj }) => {
            const dayExercises = loggedExercises.filter(e => e.day === dateStr);
            const isToday = isMounted && dayName === currentDayName;
            const isEmpty = dayExercises.length === 0;
            const shortName = SHORT_DAYS[dayName] || dayName.substring(0, 3).toUpperCase();
            const dayNum = dateObj.getDate();
            
            return (
              <div 
                key={dayName} 
                className={cn(
                  "w-full h-auto p-3 rounded-xl border shadow-sm flex flex-col transition-all duration-200",
                  isToday ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'
                )}
              >
                <div className="text-center mb-2">
                   <h3 className={`font-bold text-xs uppercase ${isToday ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                     {shortName} {dayNum}
                   </h3>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mb-2 h-7 text-xs py-1 px-2 border-dashed border-primary/40 text-primary hover:bg-primary/10 bg-white/50 dark:bg-black/50"
                  onClick={() => {
                    setSelectedDayForAdd(dateStr);
                    setIsExerciseDialogOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" /> Añadir
                </Button>

                {dayExercises.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2 text-[10px] h-6 py-0.5 px-2 text-muted-foreground hover:text-foreground bg-white/40 dark:bg-white/5"
                    onClick={() => setCopyDaySource(dateStr)}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copiar Rutina
                  </Button>
                )}

                <div className="space-y-2 pb-1">
                  {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground opacity-65 py-4">
                      <p className="text-[11px] font-semibold">Día de Descanso</p>
                      <p className="text-[9px] text-gray-400">Sin ejercicios</p>
                    </div>
                  ) : (
                    dayExercises.map(ex => (
                      <ExerciseCardCompact 
                        key={ex.id} 
                        logEx={ex} 
                        onClick={() => setEditingExerciseId(ex.id)} 
                        onDelete={() => removeExercise(ex.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Workout Modal */}
        {editingExerciseId && (
          <Dialog open={!!editingExerciseId} onOpenChange={(open) => !open && setEditingExerciseId(null)}>
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto z-50">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {editingExercise?.imageUrl ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 border">
                      <Image src={editingExercise.imageUrl} alt={editingExercise.exerciseName} width={40} height={40} className="object-cover h-full w-full" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border">
                      <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <DialogTitle className="text-xl">{editingExercise?.exerciseName}</DialogTitle>
                </div>
                <DialogDescription>
                  Ajusta las series, peso y repeticiones.
                </DialogDescription>
              </DialogHeader>
              
              {editingExercise && (
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-2">
                    <div className="col-span-2 text-center">Serie</div>
                    <div className="col-span-4 text-center">Libras/Kg</div>
                    <div className="col-span-4 text-center">Reps</div>
                    <div className="col-span-2"></div>
                  </div>

                  {editingExercise.sets.map((set, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-2 text-center font-bold text-sm bg-muted py-2 rounded-md">
                        {idx + 1}
                      </div>
                      <div className="col-span-4">
                        <Input 
                          type="number" 
                          placeholder="0" 
                          value={set.weight} 
                          onChange={(e) => updateSet(editingExercise.id, idx, "weight", e.target.value)}
                          className="text-center font-medium"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input 
                          type="number" 
                          placeholder="0" 
                          value={set.reps} 
                          onChange={(e) => updateSet(editingExercise.id, idx, "reps", e.target.value)}
                          className="text-center font-medium"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSet(editingExercise.id, idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="secondary" size="sm" onClick={() => addSet(editingExercise.id)} className="w-full mt-2 border-dashed border-2 bg-transparent hover:bg-muted text-primary">
                    <Plus className="h-4 w-4 mr-2" /> Añadir Serie
                  </Button>

                  <div className="pt-4 border-t mt-6 flex justify-between items-center">
                     <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => {
                       removeExercise(editingExercise.id);
                       setEditingExerciseId(null);
                     }}>
                       <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                     </Button>
                     <Button type="button" onClick={() => setEditingExerciseId(null)} className="bg-primary hover:bg-primary/90 text-white min-w-[100px]">
                       Listo
                     </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Copy Routine Dialog */}
        {copyDaySource && (
          <Dialog open={!!copyDaySource} onOpenChange={(open) => !open && setCopyDaySource(null)}>
            <DialogContent className="max-w-sm z-50">
              <DialogHeader>
                <DialogTitle>Copiar Rutina</DialogTitle>
                <DialogDescription>Selecciona el día destino para copiar los ejercicios.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {weekDates.map(d => (
                  <Button 
                    key={d.dateStr} 
                    type="button"
                    variant="outline" 
                    disabled={d.dateStr === copyDaySource}
                    className="hover:border-primary hover:text-primary transition-colors"
                    onClick={() => {
                      if (copyDaySource) {
                         const exercisesToCopy = loggedExercises.filter(e => e.day === copyDaySource);
                         const newExercises = exercisesToCopy.map(ex => ({
                           ...ex,
                           id: Math.random().toString(36).substr(2, 9),
                           day: d.dateStr,
                           sets: ex.sets.map(s => ({ ...s }))
                         }));
                         setLoggedExercises(prev => [...prev, ...newExercises]);
                         setCopyDaySource(null);
                         toast({ title: "Rutina copiada", description: `Ejercicios copiados al ${d.dayName}` });
                      }
                    }}
                  >
                    {d.dayName}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Exercise Dialog */}
        {isExerciseDialogOpen && (
          <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto max-w-lg z-50">
              <DialogHeader>
                <DialogTitle>Seleccionar Ejercicio</DialogTitle>
                <DialogDescription>
                  Elige un ejercicio para el {selectedDayForAdd}.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-4">
                <Input 
                  placeholder="Buscar ejercicio por nombre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Músculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los músculos</SelectItem>
                    {muscleGroups.map(m => (
                      <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 mt-4 pr-2 pb-4">
                {isLoadingExercises ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg animate-pulse">
                      <div className="h-12 w-12 bg-muted rounded-md"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : filteredExercises.slice(0, 50).map((ex) => (
                  <Button 
                    key={ex.id} 
                    type="button"
                    variant="outline" 
                    className="justify-start text-left h-auto py-3 relative overflow-hidden group hover:border-primary/50"
                    onClick={() => addExercise(ex.id)}
                  >
                    <div className="flex items-center gap-4 w-full">
                      {ex.imageUrl ? (
                        <ExerciseImage src={ex.imageUrl} alt={ex.name} />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Dumbbell className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 truncate">
                        <p className="font-semibold truncate">{ex.name}</p>
                        {ex.description ? (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ex.description}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{ex.muscleGroup}</p>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
                {!isLoadingExercises && filteredExercises.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <p className="text-center text-sm text-muted-foreground">No se encontraron ejercicios.</p>
                    <Button 
                      type="button"
                      onClick={handleAIGenerate} 
                      disabled={isGenerating || !searchQuery}
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary/5"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? "Generando con IA..." : "Generar con IA (Buscador Inteligente)"}
                    </Button>
                  </div>
                )}
                {!isLoadingExercises && filteredExercises.length > 50 && (
                  <p className="text-center text-xs text-muted-foreground pt-4">Mostrando 50 de {filteredExercises.length} resultados.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
      
      {/* CSS for hiding scrollbar visually but allowing scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
      `}} />
    </DashboardLayout>
  );
}
