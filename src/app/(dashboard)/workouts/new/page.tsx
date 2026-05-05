"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useUser } from "@/hooks/useUser";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useToast } from "@/hooks/useToast";
import { Calculator, Dumbbell, ArrowLeft, Save, TrendingUp, Flame } from "lucide-react";

const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

export default function NewWorkoutPage() {
  const router = useRouter();
  const { createWorkout } = useWorkouts();
  const { user } = useUser();
  const { getLatestMeasurement } = useMeasurements();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Workout form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "BEGINNER",
    duration: "",
  });

  // Calculator state
  const latestMeasurement = getLatestMeasurement();
  
  const [dataSource, setDataSource] = useState<"manual" | "profile">("manual");
  
  const [calcData, setCalcData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "MALE",
    activityLevel: "SEDENTARY",
  });

  const [tdee, setTdee] = useState<number | null>(null);
  const [surplus, setSurplus] = useState<number | null>(null);

  // Load profile data into calculator if available
  const hasProfileData = Boolean(
    user?.age || user?.gender || latestMeasurement?.weight || user?.weight || latestMeasurement?.height || user?.height
  );

  useEffect(() => {
    if (dataSource === "profile") {
      setCalcData({
        weight: latestMeasurement?.weight?.toString() || user?.weight?.toString() || "",
        height: latestMeasurement?.height?.toString() || user?.height?.toString() || "",
        age: user?.age?.toString() || "",
        gender: user?.gender || "MALE",
        activityLevel: user?.activityLevel || "SEDENTARY",
      });
    }
  }, [dataSource, user, latestMeasurement]);

  // Handle calculator data source change
  const handleDataSourceChange = (value: "manual" | "profile") => {
    setDataSource(value);
    if (value === "manual") {
      setCalcData({
        weight: "",
        height: "",
        age: "",
        gender: "MALE",
        activityLevel: "SEDENTARY",
      });
      setTdee(null);
      setSurplus(null);
    }
  };

  // Calculate TDEE and Surplus
  const calculateTDEE = () => {
    const weight = parseFloat(calcData.weight);
    const height = parseFloat(calcData.height);
    const age = parseInt(calcData.age);

    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa el peso, altura y edad para calcular.",
        variant: "destructive",
      });
      return;
    }

    // Mifflin-St Jeor Formula
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (calcData.gender === "MALE") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const multiplier = ACTIVITY_MULTIPLIERS[calcData.activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.2;
    const currentTdee = bmr * multiplier;
    
    setTdee(Math.round(currentTdee));
    // Superávit del 10%
    setSurplus(Math.round(currentTdee * 1.10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await createWorkout({
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      });

      toast({
        title: "¡Entrenamiento creado!",
        description: "Tu rutina se ha guardado exitosamente.",
      });

      router.push("/workouts");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el entrenamiento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Nuevo Entrenamiento"
      description="Crea una nueva rutina y planifica tu superávit"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/workouts")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Workout Form */}
          <Card className="shadow-lg border-none">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Detalles de la Rutina</CardTitle>
                  <CardDescription>Configura los datos principales de tu entrenamiento.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form id="workout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Entrenamiento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Día de Pecho y Tríceps"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Breve descripción de la rutina"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Principiante</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                        <SelectItem value="ADVANCED">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ej. 60"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Surplus Calculator */}
          <Card className="shadow-lg border-none">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Superávit de Entrenamiento</CardTitle>
                  <CardDescription>Calcula tus calorías para hipertrofia (+10%)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-2">
                <Label>Origen de Datos</Label>
                <Select
                  value={dataSource}
                  onValueChange={(value: "manual" | "profile") => handleDataSourceChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona origen de datos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Ingreso Manual</SelectItem>
                    {hasProfileData && (
                      <SelectItem value="profile">Usar mi última medición</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-weight">Peso (kg)</Label>
                  <Input
                    id="calc-weight"
                    type="number"
                    step="0.1"
                    value={calcData.weight}
                    onChange={(e) => setCalcData({ ...calcData, weight: e.target.value })}
                    disabled={dataSource === "profile"}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-height">Altura (cm)</Label>
                  <Input
                    id="calc-height"
                    type="number"
                    step="0.1"
                    value={calcData.height}
                    onChange={(e) => setCalcData({ ...calcData, height: e.target.value })}
                    disabled={dataSource === "profile"}
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-age">Edad</Label>
                  <Input
                    id="calc-age"
                    type="number"
                    value={calcData.age}
                    onChange={(e) => setCalcData({ ...calcData, age: e.target.value })}
                    disabled={dataSource === "profile"}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-gender">Género</Label>
                  <Select
                    value={calcData.gender}
                    onValueChange={(value) => setCalcData({ ...calcData, gender: value })}
                    disabled={dataSource === "profile"}
                  >
                    <SelectTrigger id="calc-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Hombre</SelectItem>
                      <SelectItem value="FEMALE">Mujer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calc-activity">Nivel de Actividad Físico</Label>
                <Select
                  value={calcData.activityLevel}
                  onValueChange={(value) => setCalcData({ ...calcData, activityLevel: value })}
                  disabled={dataSource === "profile"}
                >
                  <SelectTrigger id="calc-activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEDENTARY">Sedentario (Poco o ningún ejercicio)</SelectItem>
                    <SelectItem value="LIGHTLY_ACTIVE">Ligeramente Activo (1-3 días/semana)</SelectItem>
                    <SelectItem value="MODERATELY_ACTIVE">Moderadamente Activo (3-5 días/semana)</SelectItem>
                    <SelectItem value="VERY_ACTIVE">Muy Activo (6-7 días/semana)</SelectItem>
                    <SelectItem value="EXTRA_ACTIVE">Extra Activo (Entrenamientos intensos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateTDEE} 
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Objetivos
              </Button>

              {tdee !== null && surplus !== null && (
                <div className="mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mantenimiento (TDEE):</span>
                    <span className="font-semibold text-lg">{tdee} kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-orange-500 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> Objetivo Superávit (+10%):
                    </span>
                    <span className="font-bold text-2xl text-orange-500">{surplus} kcal</span>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button 
            type="submit" 
            form="workout-form" 
            disabled={isSaving}
            className="bg-gradient-primary px-8 text-lg py-6"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? "Creando..." : "Crear Entrenamiento"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
