"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useToast } from "@/hooks/useToast";
import { Plus, Ruler, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BodyMeasurementsChart } from "@/components/charts/BodyMeasurementsChart";

export default function MeasurementsPage() {
  const { measurements, createMeasurement, deleteMeasurement, isLoading } = useMeasurements();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
    bodyFat: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await createMeasurement({
        date: new Date(),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      });

      toast({
        title: "¡Medición registrada!",
        description: "Tu medición ha sido guardada exitosamente",
      });

      setFormData({
        weight: "",
        chest: "",
        waist: "",
        hips: "",
        biceps: "",
        thighs: "",
        bodyFat: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la medición",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMeasurement(id);
      toast({
        title: "Medición eliminada",
        description: "La medición ha sido eliminada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la medición",
        variant: "destructive",
      });
    }
  };

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  const getChange = (current?: number | null, previous?: number | null) => {
    if (!current || !previous) return null;
    return current - previous;
  };

  return (
    <DashboardLayout
      title="Mediciones"
      description="Registra y visualiza tu progreso corporal"
    >
      <div className="space-y-6">
        {/* Add Measurement Button */}
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Medición
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Medición</DialogTitle>
                <DialogDescription>
                  Ingresa tus medidas corporales actuales
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
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="70.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFat">Grasa Corporal (%)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={formData.bodyFat}
                      onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                      placeholder="15.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chest">Pecho (cm)</Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.1"
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                      placeholder="95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Cintura (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.1"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips">Cadera (cm)</Label>
                    <Input
                      id="hips"
                      type="number"
                      step="0.1"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      placeholder="95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biceps">Bíceps (cm)</Label>
                    <Input
                      id="biceps"
                      type="number"
                      step="0.1"
                      value={formData.biceps}
                      onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                      placeholder="35"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thighs">Muslos (cm)</Label>
                    <Input
                      id="thighs"
                      type="number"
                      step="0.1"
                      value={formData.thighs}
                      onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                      placeholder="55"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Latest Measurements Summary */}
        {latestMeasurement && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Peso", value: latestMeasurement.weight, unit: "kg", key: "weight" },
              { label: "Grasa", value: latestMeasurement.bodyFat, unit: "%", key: "bodyFat" },
              { label: "Cintura", value: latestMeasurement.waist, unit: "cm", key: "waist" },
              { label: "Pecho", value: latestMeasurement.chest, unit: "cm", key: "chest" },
            ].map((item) => {
              const change = getChange(
                item.value,
                previousMeasurement?.[item.key as keyof typeof previousMeasurement] as number
              );
              return (
                <Card key={item.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-bold">
                          {item.value ? `${item.value}${item.unit}` : "N/A"}
                        </p>
                        {change !== null && (
                          <p className={`text-sm flex items-center gap-1 ${change > 0 ? "text-red-500" : "text-green-500"}`}>
                            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(change).toFixed(1)}{item.unit}
                          </p>
                        )}
                      </div>
                      <Ruler className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {measurements.length > 1 && <BodyMeasurementsChart measurements={measurements} />}

        {/* Measurements History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Mediciones</CardTitle>
          </CardHeader>
          <CardContent>
            {measurements.length > 0 ? (
              <div className="space-y-4">
                {measurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{formatDate(measurement.date)}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        {measurement.weight && <span>Peso: {measurement.weight}kg</span>}
                        {measurement.waist && <span>Cintura: {measurement.waist}cm</span>}
                        {measurement.chest && <span>Pecho: {measurement.chest}cm</span>}
                        {measurement.bodyFat && <span>Grasa: {measurement.bodyFat}%</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(measurement.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ruler className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay mediciones registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
