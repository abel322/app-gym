"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, isLoading, refetch } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    goal: user?.goal || "",
    activityLevel: user?.activityLevel || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || undefined,
          gender: formData.gender || undefined,
          age: formData.age ? parseInt(formData.age as string) : undefined,
          height: formData.height ? parseFloat(formData.height as string) : undefined,
          weight: formData.weight ? parseFloat(formData.weight as string) : undefined,
          goal: formData.goal || undefined,
          activityLevel: formData.activityLevel || undefined,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar perfil");

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados exitosamente",
      });

      await refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Perfil" description="Gestiona tu información personal">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Perfil"
      description="Gestiona tu información personal y objetivos"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || "Usuario"}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información para obtener recomendaciones personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Femenino</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="Tu edad"
                    min="10"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    placeholder="170"
                    min="100"
                    max="250"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="70"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Objetivo</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) =>
                      setFormData({ ...formData, goal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOSE_WEIGHT">Perder Peso</SelectItem>
                      <SelectItem value="GAIN_MUSCLE">Ganar Músculo</SelectItem>
                      <SelectItem value="MAINTAIN">Mantener</SelectItem>
                      <SelectItem value="RECOMPOSITION">Recomposición</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="activityLevel">Nivel de Actividad</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, activityLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu nivel de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEDENTARY">
                        Sedentario (poco o ningún ejercicio)
                      </SelectItem>
                      <SelectItem value="LIGHTLY_ACTIVE">
                        Ligeramente activo (1-3 días/semana)
                      </SelectItem>
                      <SelectItem value="MODERATELY_ACTIVE">
                        Moderadamente activo (3-5 días/semana)
                      </SelectItem>
                      <SelectItem value="VERY_ACTIVE">
                        Muy activo (6-7 días/semana)
                      </SelectItem>
                      <SelectItem value="EXTRA_ACTIVE">
                        Extra activo (atleta/trabajo físico)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-primary"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
