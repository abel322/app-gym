"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, AlertCircle, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface WeeklyData {
  week: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  biceps: number;
  thighs: number;
  date: string;
}

export function WeeklyProgressTracker() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [formData, setFormData] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: WeeklyData = {
      week: weeklyData.length + 1,
      weight: parseFloat(formData.weight),
      chest: parseFloat(formData.chest),
      waist: parseFloat(formData.waist),
      hips: parseFloat(formData.hips),
      biceps: parseFloat(formData.biceps),
      thighs: parseFloat(formData.thighs),
      date: new Date().toISOString(),
    };

    setWeeklyData([newEntry, ...weeklyData]);
    
    toast({
      title: "¡Medición registrada!",
      description: "Tu progreso semanal ha sido guardado",
    });

    setFormData({
      weight: "",
      chest: "",
      waist: "",
      hips: "",
      biceps: "",
      thighs: "",
    });
    setIsDialogOpen(false);
  };

  const calculateChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change: change.toFixed(1), percentage };
  };

  const calculateWaistHipRatio = (waist: number, hips: number) => {
    return (waist / hips).toFixed(2);
  };

  const getRecommendation = () => {
    if (weeklyData.length < 2) return null;

    const latest = weeklyData[0];
    const previous = weeklyData[1];
    
    const weightChange = latest.weight - previous.weight;
    const waistChange = latest.waist - previous.waist;
    const muscleGrowth = (latest.chest - previous.chest) + (latest.biceps - previous.biceps) + (latest.thighs - previous.thighs);

    if (weightChange > 0.8) {
      return {
        type: "warning",
        message: "Estás ganando peso muy rápido. Considera reducir 100-200 kcal para minimizar ganancia de grasa.",
      };
    } else if (weightChange < 0.2) {
      return {
        type: "info",
        message: "Tu ganancia de peso es lenta. Considera aumentar 100-200 kcal para optimizar el crecimiento muscular.",
      };
    } else if (waistChange > 1.5 && muscleGrowth < 1) {
      return {
        type: "warning",
        message: "Tu cintura está creciendo más que tus músculos. Ajusta tu dieta y asegúrate de entrenar con intensidad.",
      };
    } else {
      return {
        type: "success",
        message: "¡Excelente progreso! Mantén tu plan actual de nutrición y entrenamiento.",
      };
    }
  };

  const recommendation = getRecommendation();
  const latest = weeklyData[0];
  const previous = weeklyData[1];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seguimiento Semanal
            </CardTitle>
            <CardDescription>
              Registra tus mediciones cada semana para monitorear tu progreso
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Semana
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mediciones de la Semana {weeklyData.length + 1}</DialogTitle>
                <DialogDescription>
                  Registra tus mediciones actuales
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chest">Pecho (cm)</Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.1"
                      required
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Cintura (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.1"
                      required
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips">Cadera (cm)</Label>
                    <Input
                      id="hips"
                      type="number"
                      step="0.1"
                      required
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biceps">Bíceps (cm)</Label>
                    <Input
                      id="biceps"
                      type="number"
                      step="0.1"
                      required
                      value={formData.biceps}
                      onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thighs">Muslos (cm)</Label>
                    <Input
                      id="thighs"
                      type="number"
                      step="0.1"
                      required
                      value={formData.thighs}
                      onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendation */}
        {recommendation && (
          <div className={`p-4 rounded-lg border ${
            recommendation.type === "success" ? "bg-green-500/10 border-green-500/20" :
            recommendation.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20" :
            "bg-blue-500/10 border-blue-500/20"
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${
                recommendation.type === "success" ? "text-green-400" :
                recommendation.type === "warning" ? "text-yellow-400" :
                "text-blue-400"
              }`} />
              <div>
                <h4 className="font-semibold mb-1">Recomendación</h4>
                <p className="text-sm text-muted-foreground">{recommendation.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Measurements */}
        {latest && previous && (
          <div className="space-y-4">
            <h4 className="font-semibold">Cambios desde la semana anterior:</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Peso", current: latest.weight, prev: previous.weight, unit: "kg" },
                { label: "Pecho", current: latest.chest, prev: previous.chest, unit: "cm" },
                { label: "Cintura", current: latest.waist, prev: previous.waist, unit: "cm" },
                { label: "Cadera", current: latest.hips, prev: previous.hips, unit: "cm" },
                { label: "Bíceps", current: latest.biceps, prev: previous.biceps, unit: "cm" },
                { label: "Muslos", current: latest.thighs, prev: previous.thighs, unit: "cm" },
              ].map((item) => {
                const { change, percentage } = calculateChange(item.current, item.prev);
                const isPositive = parseFloat(change) > 0;
                
                return (
                  <div key={item.label} className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl font-bold">{item.current}{item.unit}</p>
                    <div className={`flex items-center gap-1 text-sm ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>{change}{item.unit} ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Waist-Hip Ratio */}
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-2">Ratio Cintura/Cadera</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{calculateWaistHipRatio(latest.waist, latest.hips)}</p>
                  <p className="text-sm text-muted-foreground">
                    Anterior: {calculateWaistHipRatio(previous.waist, previous.hips)}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Ideal Hombres: &lt;0.90</p>
                  <p>Ideal Mujeres: &lt;0.85</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {weeklyData.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay mediciones registradas</p>
            <p className="text-sm text-muted-foreground mt-2">
              Comienza a registrar tus mediciones semanales para ver tu progreso
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
