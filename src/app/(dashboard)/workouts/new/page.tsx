"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, Plus, Trash2, Flame, Calendar, Dumbbell } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  imageUrl?: string;
}

interface SetData {
  reps: string;
  weight: string;
}

interface LoggedExercise {
  id: string; // unique ID for the UI
  exerciseId: string;
  exerciseName: string;
  sets: SetData[];
}

const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

export default function LogWorkoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { getLatestMeasurement } = useMeasurements();
  const { toast } = useToast();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [surplusTarget, setSurplusTarget] = useState<number | null>(null);

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
    if (!ex) return;
    
    setLoggedExercises([
      ...loggedExercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        exerciseId,
        exerciseName: ex.name,
        sets: [{ reps: "", weight: "" }],
      },
    ]);
    setIsExerciseDialogOpen(false);
  };

  const removeExercise = (id: string) => {
    setLoggedExercises(loggedExercises.filter((e) => e.id !== id));
  };

  const addSet = (exerciseId: string) => {
    setLoggedExercises(
      loggedExercises.map((e) => {
        if (e.id === exerciseId) {
          // Copy last set values for convenience
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
      toast({ title: "Entrenamiento vacío", description: "Agrega al menos un ejercicio.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/workouts/log-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Entrenamiento - ${date}`,
          date: new Date(date).toISOString(),
          exercises: loggedExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
          })),
        }),
      });

      if (!response.ok) throw new Error("Fallo al guardar");

      toast({
        title: "¡Entrenamiento Finalizado!",
        description: "Tu sesión ha sido registrada correctamente.",
      });
      router.push("/workouts");
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un problema al guardar el entrenamiento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Registrar Entrenamiento"
      description="Anota tus ejercicios, series y repeticiones de hoy"
    >
      <div className="space-y-6 pb-20">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/workouts")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-40"
            />
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

        {/* Exercises List */}
        <div className="space-y-4">
          {loggedExercises.map((logEx) => (
            <Card key={logEx.id} className="shadow-md">
              <CardHeader className="py-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {logEx.exerciseName}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeExercise(logEx.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-2">
                  <div className="col-span-2 text-center">Serie</div>
                  <div className="col-span-4 text-center">Libras/Kg</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-2"></div>
                </div>

                {logEx.sets.map((set, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2 text-center font-bold text-sm bg-muted py-2 rounded-md">
                      {idx + 1}
                    </div>
                    <div className="col-span-4">
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={set.weight} 
                        onChange={(e) => updateSet(logEx.id, idx, "weight", e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={set.reps} 
                        onChange={(e) => updateSet(logEx.id, idx, "reps", e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="col-span-2 text-center">
                      <Button variant="ghost" size="icon" onClick={() => removeSet(logEx.id, idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="secondary" size="sm" onClick={() => addSet(logEx.id)} className="w-full mt-2 border-dashed border-2 bg-transparent hover:bg-muted">
                  <Plus className="h-4 w-4 mr-2" /> Añadir Serie
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Exercise Button */}
        <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full py-8 text-lg border-dashed border-2 border-primary/50 text-primary hover:bg-primary/5">
              <Plus className="h-5 w-5 mr-2" /> Añadir Ejercicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Ejercicio</DialogTitle>
              <DialogDescription>Elige un ejercicio para agregar a tu rutina actual.</DialogDescription>
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
                  className="justify-start text-left h-auto py-3 relative overflow-hidden group"
                  onClick={() => addExercise(ex.id)}
                >
                  <div className="flex items-center gap-4 w-full">
                    {ex.imageUrl ? (
                      <div className="h-12 w-12 rounded-md bg-white shrink-0 overflow-hidden border flex items-center justify-center">
                        <img src={ex.imageUrl} alt={ex.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Dumbbell className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 truncate">
                      <p className="font-semibold truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ex.muscleGroup}</p>
                    </div>
                  </div>
                </Button>
              ))}
              {!isLoadingExercises && filteredExercises.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No se encontraron ejercicios.</p>
              )}
              {!isLoadingExercises && filteredExercises.length > 50 && (
                <p className="text-center text-xs text-muted-foreground pt-4">Mostrando 50 de {filteredExercises.length} resultados. Usa los filtros.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t lg:pl-64 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <Button 
            className="w-full max-w-4xl mx-auto block bg-gradient-primary text-lg py-6"
            onClick={handleSave}
            disabled={isSaving || loggedExercises.length === 0}
          >
            <Save className="h-5 w-5 mr-2 inline-block" />
            {isSaving ? "Guardando..." : "Finalizar Entrenamiento"}
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
