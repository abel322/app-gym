"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Save, Plus, Trash2, Flame, Dumbbell, Sparkles, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { searchOrGenerateExercise } from "@/app/actions/exercise";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  imageUrl?: string;
  description?: string;
}

interface SetData {
  reps: string;
  weight: string;
}

interface LoggedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl?: string;
  description?: string;
  date: string; // YYYY-MM-DD local format
  sets: SetData[];
}

const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

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

function ExerciseCardCompact({ logEx, onClick }: { logEx: LoggedExercise, onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:border-primary transition-colors shadow-sm bg-white dark:bg-black overflow-hidden" onClick={onClick}>
      <div className="p-3 flex items-center gap-3">
         {logEx.imageUrl ? (
           <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 bg-muted border">
             <Image src={logEx.imageUrl} alt={logEx.exerciseName} width={40} height={40} className="object-cover h-full w-full" />
           </div>
         ) : (
           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border">
             <Dumbbell className="h-5 w-5 text-muted-foreground" />
           </div>
         )}
         <div className="flex-1 min-w-0">
           <p className="font-semibold text-sm truncate text-foreground">{logEx.exerciseName}</p>
           <div className="text-[10px] font-bold text-primary bg-primary/10 inline-flex items-center px-2 py-0.5 rounded-full mt-1">
             {logEx.sets.length} {logEx.sets.length === 1 ? 'serie' : 'series'}
           </div>
         </div>
      </div>
    </Card>
  );
}

export default function LogWorkoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { getLatestMeasurement } = useMeasurements();
  const { toast } = useToast();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState<string | null>(null);
  
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [copyDaySource, setCopyDaySource] = useState<string | null>(null);

  const [surplusTarget, setSurplusTarget] = useState<number | null>(null);

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

  // Safe today string for comparison
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Fetch exercises list
  useEffect(() => {
    setIsLoadingExercises(true);
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExercises(data);
      })
      .catch((err) => console.error("Error fetching exercises", err))
      .finally(() => setIsLoadingExercises(false));
  }, []);

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "all" || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = Array.from(new Set(exercises.map((ex) => ex.muscleGroup))).sort();

  // Calculate surplus automatically
  useEffect(() => {
    const latestMeasurement = getLatestMeasurement();
    const weight = latestMeasurement?.weight || user?.weight;
    const height = latestMeasurement?.height || user?.height;
    const age = user?.age;
    const gender = user?.gender;
    const activity = user?.activityLevel || "SEDENTARY";

    if (weight && height && age && gender) {
      let bmr = 10 * weight + 6.25 * height - 5 * age;
      bmr += gender === "MALE" ? 5 : -161;
      const multiplier = ACTIVITY_MULTIPLIERS[activity as keyof typeof ACTIVITY_MULTIPLIERS] || 1.2;
      const tdee = bmr * multiplier;
      setSurplusTarget(Math.round(tdee * 1.10));
    }
  }, [user, getLatestMeasurement]);

  const addExercise = (exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!ex || !selectedDateForAdd) return;
    
    const newId = Math.random().toString(36).substr(2, 9);
    setLoggedExercises([
      ...loggedExercises,
      {
        id: newId,
        exerciseId,
        exerciseName: ex.name,
        imageUrl: ex.imageUrl,
        description: ex.description,
        date: selectedDateForAdd,
        sets: [{ reps: "", weight: "" }],
      },
    ]);
    setIsExerciseDialogOpen(false);
    setTimeout(() => setEditingExerciseId(newId), 150);
  };

  const handleAIGenerate = async () => {
    if (!searchQuery || !selectedDateForAdd) return;
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
          date: selectedDateForAdd,
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
      const byDate = loggedExercises.reduce((acc, ex) => {
        if (!acc[ex.date]) acc[ex.date] = [];
        acc[ex.date].push(ex);
        return acc;
      }, {} as Record<string, LoggedExercise[]>);

      for (const [dateStr, exList] of Object.entries(byDate)) {
        // Use Midday UTC to avoid timezone drift
        const response = await fetch("/api/workouts/log-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Entrenamiento del ${dateStr}`,
            date: new Date(dateStr + "T12:00:00Z").toISOString(),
            exercises: exList.map((ex) => ({
              exerciseId: ex.exerciseId,
              sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
            })),
          }),
        });
        if (!response.ok) throw new Error(`Fallo al guardar el día ${dateStr}`);
      }

      toast({
        title: "¡Semana Guardada!",
        description: "Tu cronograma semanal ha sido registrado correctamente.",
      });
      router.push("/workouts");
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
      title="Cronograma Semanal"
      description="Planifica y registra tus entrenamientos para toda la semana"
    >
      <div className="space-y-6 pb-24">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/workouts")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
          
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border w-full sm:w-auto justify-between sm:justify-start">
            <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold px-2 text-center min-w-[140px] text-primary">
              {currentWeekStart.toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })} - 
              {' '}{currentWeekEnd.toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
            </div>
            <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info Banner (Surplus) */}
        {surplusTarget && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-600">Objetivo Calórico (Hipertrofia)</p>
                <p className="text-xs text-muted-foreground">Calculado según tu perfil</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{surplusTarget} kcal</p>
            </div>
          </div>
        )}

        {/* Weekly Grid */}
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x lg:grid lg:grid-cols-7 lg:gap-4 lg:snap-none hide-scrollbar">
          {weekDates.map(({ dateStr, dayName, dateObj }) => {
            const dayExercises = loggedExercises.filter(e => e.date === dateStr);
            const isToday = dateStr === todayStr;
            
            return (
              <div 
                key={dateStr} 
                className={`min-w-[280px] lg:min-w-0 snap-center flex-shrink-0 rounded-2xl p-3 flex flex-col h-[65vh] border transition-all ${
                  isToday ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-gray-50/80 dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'
                }`}
              >
                <div className="text-center mb-4">
                   <h3 className={`font-bold capitalize ${isToday ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                     {dayName}
                   </h3>
                   <p className="text-xs text-muted-foreground">
                     {dateObj.toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
                   </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mb-3 border-dashed border-primary/40 text-primary hover:bg-primary/10 bg-white/50 dark:bg-black/50"
                  onClick={() => {
                    setSelectedDateForAdd(dateStr);
                    setIsExerciseDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Añadir
                </Button>

                {dayExercises.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-3 text-xs h-8 text-muted-foreground hover:text-foreground bg-white/40 dark:bg-white/5"
                    onClick={() => setCopyDaySource(dateStr)}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copiar Rutina
                  </Button>
                )}

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-2 custom-scrollbar">
                  {dayExercises.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Dumbbell className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">Descanso</p>
                      <p className="text-xs">Sin entrenos</p>
                    </div>
                  ) : (
                    dayExercises.map(ex => (
                      <ExerciseCardCompact key={ex.id} logEx={ex} onClick={() => setEditingExerciseId(ex.id)} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Workout Modal */}
        <Dialog open={!!editingExerciseId} onOpenChange={(open) => !open && setEditingExerciseId(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
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
                      <Button variant="ghost" size="icon" onClick={() => removeSet(editingExercise.id, idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="secondary" size="sm" onClick={() => addSet(editingExercise.id)} className="w-full mt-2 border-dashed border-2 bg-transparent hover:bg-muted text-primary">
                  <Plus className="h-4 w-4 mr-2" /> Añadir Serie
                </Button>

                <div className="pt-4 border-t mt-6 flex justify-between items-center">
                   <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => {
                     removeExercise(editingExercise.id);
                     setEditingExerciseId(null);
                   }}>
                     <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                   </Button>
                   <Button onClick={() => setEditingExerciseId(null)} className="bg-primary hover:bg-primary/90 text-white min-w-[100px]">
                     Listo
                   </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Copy Routine Dialog */}
        <Dialog open={!!copyDaySource} onOpenChange={(open) => !open && setCopyDaySource(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Copiar Rutina</DialogTitle>
              <DialogDescription>Selecciona el día destino para copiar los ejercicios.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {weekDates.map(d => (
                <Button 
                  key={d.dateStr} 
                  variant="outline" 
                  disabled={d.dateStr === copyDaySource}
                  className="hover:border-primary hover:text-primary transition-colors"
                  onClick={() => {
                    if (copyDaySource) {
                       const exercisesToCopy = loggedExercises.filter(e => e.date === copyDaySource);
                       const newExercises = exercisesToCopy.map(ex => ({
                         ...ex,
                         id: Math.random().toString(36).substr(2, 9),
                         date: d.dateStr,
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

        {/* Add Exercise Dialog */}
        <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto max-w-lg">
            <DialogHeader>
              <DialogTitle>Seleccionar Ejercicio</DialogTitle>
              <DialogDescription>
                Elige un ejercicio para el {selectedDateForAdd ? (() => {
                  const [yyyy, mm, dd] = selectedDateForAdd.split('-');
                  const d = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
                  return d.toLocaleDateString('es-VE', { weekday: 'long' });
                })() : ''}.
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

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t lg:pl-64 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Button 
            className="w-full max-w-4xl mx-auto block bg-gradient-primary text-lg py-6 shadow-lg hover:shadow-xl transition-shadow"
            onClick={handleSave}
            disabled={isSaving || loggedExercises.length === 0}
          >
            <Save className="h-5 w-5 mr-2 inline-block" />
            {isSaving ? "Guardando Semana..." : "Guardar Cronograma Semanal"}
          </Button>
        </div>

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
