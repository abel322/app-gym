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
import { Pencil, Plus, Ruler, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { BodyMeasurement } from "@/types";
import { formatDate } from "@/lib/utils";
import { BodyMeasurementsChart } from "@/components/charts/BodyMeasurementsChart";

export default function MeasurementsPage() {
  const { measurements, createMeasurement, updateMeasurement, deleteMeasurement, isLoading, loadMeasurements } = useMeasurements();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
    calves: "",
    neck: "",
    shoulders: "",
    bodyFat: "",
    muscleMass: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        weight: formData.weight ? parseFloat(formData.weight) : null,
        chest: formData.chest ? parseFloat(formData.chest) : null,
        waist: formData.waist ? parseFloat(formData.waist) : null,
        hips: formData.hips ? parseFloat(formData.hips) : null,
        biceps: formData.biceps ? parseFloat(formData.biceps) : null,
        thighs: formData.thighs ? parseFloat(formData.thighs) : null,
        calves: formData.calves ? parseFloat(formData.calves) : null,
        neck: formData.neck ? parseFloat(formData.neck) : null,
        shoulders: formData.shoulders ? parseFloat(formData.shoulders) : null,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : null,
      };

      if (editingId) {
        await updateMeasurement(editingId, data);
        toast({
          title: "¡Medición actualizada!",
          description: "Tu medición ha sido actualizada exitosamente",
        });
      } else {
        await createMeasurement({
          ...data,
          date: new Date(),
        });
        toast({
          title: "¡Medición registrada!",
          description: "Tu medición ha sido guardada exitosamente",
        });
      }

      setFormData({
        weight: "",
        chest: "",
        waist: "",
        hips: "",
        biceps: "",
        thighs: "",
        calves: "",
        neck: "",
        shoulders: "",
        bodyFat: "",
        muscleMass: "",
      });
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${editingId ? "actualizar" : "guardar"} la medición`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (measurement: BodyMeasurement) => {
    setFormData({
      weight: measurement.weight?.toString() || "",
      chest: measurement.chest?.toString() || "",
      waist: measurement.waist?.toString() || "",
      hips: measurement.hips?.toString() || "",
      biceps: measurement.biceps?.toString() || "",
      thighs: measurement.thighs?.toString() || "",
      calves: measurement.calves?.toString() || "",
      neck: measurement.neck?.toString() || "",
      shoulders: measurement.shoulders?.toString() || "",
      bodyFat: measurement.bodyFat?.toString() || "",
      muscleMass: measurement.muscleMass?.toString() || "",
    });
    setEditingId(measurement.id);
    setIsDialogOpen(true);
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
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setFormData({
                  weight: "", chest: "", waist: "", hips: "", biceps: "", thighs: "",
                  calves: "", neck: "", shoulders: "", bodyFat: "", muscleMass: ""
                });
              }
            }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Medición
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingId ? "Editar Medición" : "Registrar Medición"}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {editingId ? "Modifica tus medidas corporales" : "Ingresa tus medidas corporales actuales."}
                  {latestMeasurement && !editingId && (
                    <span className="block mt-2 text-sm text-primary font-semibold bg-primary/5 p-2 rounded-lg border border-primary/10">
                      Última medición: {formatDate(latestMeasurement.date)}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Composición Corporal */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Composición Corporal
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="weight">Peso (kg)</Label>
                          {latestMeasurement?.weight && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.weight}kg</span>
                          )}
                        </div>
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
                        <div className="flex justify-between items-center">
                          <Label htmlFor="bodyFat">Grasa Corporal (%)</Label>
                          {latestMeasurement?.bodyFat && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.bodyFat}%</span>
                          )}
                        </div>
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
                        <div className="flex justify-between items-center">
                          <Label htmlFor="muscleMass">Masa Muscular (kg)</Label>
                          {latestMeasurement?.muscleMass && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.muscleMass}kg</span>
                          )}
                        </div>
                        <Input
                          id="muscleMass"
                          type="number"
                          step="0.1"
                          value={formData.muscleMass}
                          onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                          placeholder="55.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medidas Tronco */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> Tronco y Cuello
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="neck">Cuello (cm)</Label>
                          {latestMeasurement?.neck && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.neck}cm</span>
                          )}
                        </div>
                        <Input
                          id="neck"
                          type="number"
                          step="0.1"
                          value={formData.neck}
                          onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                          placeholder="38.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="shoulders">Hombros (cm)</Label>
                          {latestMeasurement?.shoulders && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.shoulders}cm</span>
                          )}
                        </div>
                        <Input
                          id="shoulders"
                          type="number"
                          step="0.1"
                          value={formData.shoulders}
                          onChange={(e) => setFormData({ ...formData, shoulders: e.target.value })}
                          placeholder="115.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="chest">Pecho (cm)</Label>
                          {latestMeasurement?.chest && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.chest}cm</span>
                          )}
                        </div>
                        <Input
                          id="chest"
                          type="number"
                          step="0.1"
                          value={formData.chest}
                          onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                          placeholder="95.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medidas Inferior */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" /> Cintura y Cadera
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="waist">Cintura (cm)</Label>
                          {latestMeasurement?.waist && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.waist}cm</span>
                          )}
                        </div>
                        <Input
                          id="waist"
                          type="number"
                          step="0.1"
                          value={formData.waist}
                          onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                          placeholder="80.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="hips">Cadera (cm)</Label>
                          {latestMeasurement?.hips && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.hips}cm</span>
                          )}
                        </div>
                        <Input
                          id="hips"
                          type="number"
                          step="0.1"
                          value={formData.hips}
                          onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                          placeholder="95.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extremidades */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> Extremidades
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="biceps">Bíceps (cm)</Label>
                          {latestMeasurement?.biceps && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.biceps}cm</span>
                          )}
                        </div>
                        <Input
                          id="biceps"
                          type="number"
                          step="0.1"
                          value={formData.biceps}
                          onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                          placeholder="35.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="thighs">Muslos (cm)</Label>
                          {latestMeasurement?.thighs && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.thighs}cm</span>
                          )}
                        </div>
                        <Input
                          id="thighs"
                          type="number"
                          step="0.1"
                          value={formData.thighs}
                          onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                          placeholder="55.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="calves">Pantorrillas (cm)</Label>
                          {latestMeasurement?.calves && (
                            <span className="text-xs text-muted-foreground">Último: {latestMeasurement.calves}cm</span>
                          )}
                        </div>
                        <Input
                          id="calves"
                          type="number"
                          step="0.1"
                          value={formData.calves}
                          onChange={(e) => setFormData({ ...formData, calves: e.target.value })}
                          placeholder="38.0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving} className="bg-gradient-primary px-8">
                    {isSaving ? "Guardando..." : editingId ? "Actualizar Medición" : "Guardar Medición"}
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
              { label: "Peso Corporal", value: latestMeasurement.weight, unit: "kg", key: "weight", icon: TrendingUp, color: "from-blue-500 to-indigo-600" },
              { label: "Grasa Corporal", value: latestMeasurement.bodyFat, unit: "%", key: "bodyFat", icon: Ruler, color: "from-pink-500 to-rose-600" },
              { label: "Masa Muscular", value: latestMeasurement.muscleMass, unit: "kg", key: "muscleMass", icon: Plus, color: "from-emerald-500 to-teal-600" },
              { label: "Cintura", value: latestMeasurement.waist, unit: "cm", key: "waist", icon: Ruler, color: "from-amber-500 to-orange-600" },
            ].map((item) => {
              const change = getChange(
                item.value,
                previousMeasurement?.[item.key as keyof typeof previousMeasurement] as number
              );
              return (
                <Card key={item.label} className="overflow-hidden border-none shadow-lg">
                  <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <p className="text-3xl font-bold tracking-tight">
                            {item.value ? item.value : "N/A"}
                          </p>
                          <span className="text-sm font-medium text-muted-foreground">{item.unit}</span>
                        </div>
                        {change !== null && (
                          <p className={`text-xs flex items-center gap-1 mt-2 font-semibold ${change > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(change).toFixed(1)}{item.unit} desde la última vez
                          </p>
                        )}
                      </div>
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {measurements.length > 1 && (
          <div className="grid gap-6">
            <BodyMeasurementsChart measurements={measurements} />
          </div>
        )}

        {/* Measurements History */}
        <Card className="shadow-xl border-none">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Historial de Mediciones</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Todas tus medidas registradas cronológicamente</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => loadMeasurements()} className="gap-2">
                <Plus className="h-4 w-4" /> Refrescar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {measurements.length > 0 ? (
              <div className="divide-y">
                {measurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="p-6 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Ruler className="h-4 w-4 text-primary" />
                          </div>
                          <p className="font-bold text-lg">{formatDate(measurement.date)}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-8">
                          {[
                            { label: "Peso", value: measurement.weight, unit: "kg" },
                            { label: "Grasa", value: measurement.bodyFat, unit: "%" },
                            { label: "Masa Muscular", value: measurement.muscleMass, unit: "kg" },
                            { label: "Pecho", value: measurement.chest, unit: "cm" },
                            { label: "Cintura", value: measurement.waist, unit: "cm" },
                            { label: "Cadera", value: measurement.hips, unit: "cm" },
                            { label: "Bíceps", value: measurement.biceps, unit: "cm" },
                            { label: "Muslos", value: measurement.thighs, unit: "cm" },
                            { label: "Cuello", value: measurement.neck, unit: "cm" },
                            { label: "Hombros", value: measurement.shoulders, unit: "cm" },
                            { label: "Pantorrillas", value: measurement.calves, unit: "cm" },
                          ].filter(m => m.value != null).map((m) => (
                            <div key={m.label} className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{m.label}</p>
                              <p className="text-sm font-semibold">{m.value}{m.unit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(measurement)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(measurement.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Ruler className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Sin registros aún</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                  Empieza a registrar tus medidas para ver tu progreso aquí.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
