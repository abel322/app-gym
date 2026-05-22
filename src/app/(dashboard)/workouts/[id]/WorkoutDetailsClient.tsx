"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Save, Plus, Trash2, Flame, Dumbbell, Sparkles, Copy } from "lucide-react";
import Image from "next/image";
import { searchOrGenerateExercise } from "@/app/actions/exercise";

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

export function WorkoutDetailsClient({ initialWorkout, surplusTarget }: WorkoutDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");

  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() => {
    return initialWorkout.exercises.map((ex) => {
      const setsArray = [];
      for (let i = 0; i < ex.sets; i++) {
        setsArray.push({
          reps: ex.reps.toString(),
          weight: (ex.weight ?? 0).toString()
        });
      }
      return {
        id: ex.id,
        exerciseId: ex.exerciseId,
        exerciseName: ex.exercise.name,
        imageUrl: ex.exercise.imageUrl || undefined,
        description: ex.exercise.description || undefined,
        day: ex.day || "Lunes",
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      title="Cronograma Semanal"
      description="Planifica y registra tus entrenamientos para toda la semana"
    >
      <div className="space-y-6 pb-24">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => router.push("/workouts")} className="gap-2 hover:bg-muted/50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
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
          {DIAS_SEMANA.map((dayName) => {
            const dayExercises = loggedExercises.filter(e => e.day === dayName);
            const isToday = isMounted && dayName === currentDayName;
            
            return (
              <div 
                key={dayName} 
                className={`min-w-[280px] lg:min-w-0 snap-center flex-shrink-0 rounded-2xl p-3 flex flex-col h-[65vh] border transition-all ${
                  isToday ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-gray-50/80 dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'
                }`}
              >
                <div className="text-center mb-4">
                   <h3 className={`font-bold capitalize ${isToday ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                     {dayName}
                   </h3>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mb-3 border-dashed border-primary/40 text-primary hover:bg-primary/10 bg-white/50 dark:bg-black/50"
                  onClick={() => {
                    setSelectedDayForAdd(dayName);
                    setIsExerciseDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Añadir
                </Button>

                {dayExercises.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full mb-3 text-xs h-8 text-muted-foreground hover:text-foreground bg-white/40 dark:bg-white/5"
                    onClick={() => setCopyDaySource(dayName)}
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
                {DIAS_SEMANA.map(dayName => (
                  <Button 
                    key={dayName} 
                    type="button"
                    variant="outline" 
                    disabled={dayName === copyDaySource}
                    className="hover:border-primary hover:text-primary transition-colors"
                    onClick={() => {
                      if (copyDaySource) {
                         const exercisesToCopy = loggedExercises.filter(e => e.day === copyDaySource);
                         const newExercises = exercisesToCopy.map(ex => ({
                           ...ex,
                           id: Math.random().toString(36).substr(2, 9),
                           day: dayName,
                           sets: ex.sets.map(s => ({ ...s }))
                         }));
                         setLoggedExercises(prev => [...prev, ...newExercises]);
                         setCopyDaySource(null);
                         toast({ title: "Rutina copiada", description: `Ejercicios copiados al ${dayName}` });
                      }
                    }}
                  >
                    {dayName}
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

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t lg:pl-64 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Button 
            className="w-full max-w-4xl mx-auto block bg-gradient-primary text-lg py-6 shadow-lg hover:shadow-xl transition-shadow text-white font-semibold"
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
