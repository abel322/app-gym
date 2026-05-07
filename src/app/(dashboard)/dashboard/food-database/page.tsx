"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { Pencil, Trash2, Plus, UploadCloud, Utensils, Info } from "lucide-react";
import { getFoods, createFood, deleteFood } from "@/app/actions/food";
import Image from "next/image";

type Food = {
  id: string;
  name: string;
  imageUrl: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export default function FoodDatabasePage() {
  const { toast } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const data = await getFoods();
      setFoods(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los alimentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = null;

      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      await createFood({
        name: formData.name,
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fats: Number(formData.fats),
        imageUrl,
      });

      toast({
        title: "¡Alimento guardado!",
        description: "El alimento se ha registrado exitosamente en la base de datos.",
      });

      // Reset form
      setFormData({ name: "", calories: "", protein: "", carbs: "", fats: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      loadFoods();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el alimento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este alimento?")) return;
    try {
      await deleteFood(id);
      toast({
        title: "Alimento eliminado",
        description: "El alimento se ha eliminado de la base de datos.",
      });
      setFoods(foods.filter((f) => f.id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el alimento.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout
      title="Base de Datos de Alimentos"
      description="Registra y administra los alimentos para tus planes nutricionales."
    >
      <div className="space-y-8">
        
        {/* Formulario de Registro */}
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-violet-500/10 to-blue-500/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5 text-violet-600" />
              Registrar Nuevo Alimento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label>Imagen del Alimento</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative h-[200px] overflow-hidden">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="object-cover w-full h-full absolute inset-0" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                            Cambiar Imagen
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto">
                          <UploadCloud className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Sube una imagen o arrástrala</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()} className="mt-2">
                          Seleccionar archivo
                        </Button>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Alimento</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Ej. Pechuga de Pollo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="calories">Calorías (kcal)</Label>
                      <Input
                        id="calories"
                        type="number"
                        step="0.1"
                        required
                        placeholder="0"
                        value={formData.calories}
                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                        className="bg-background border-orange-200 focus-visible:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="protein">Proteínas (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        step="0.1"
                        required
                        placeholder="0"
                        value={formData.protein}
                        onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                        className="bg-background border-blue-200 focus-visible:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbs">Carbohidratos (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        step="0.1"
                        required
                        placeholder="0"
                        value={formData.carbs}
                        onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                        className="bg-background border-green-200 focus-visible:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fats">Grasas (g)</Label>
                      <Input
                        id="fats"
                        type="number"
                        step="0.1"
                        required
                        placeholder="0"
                        value={formData.fats}
                        onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                        className="bg-background border-yellow-200 focus-visible:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={isSaving} className="bg-gradient-primary px-8">
                  {isSaving ? "Guardando..." : "Guardar Alimento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Alimentos */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Alimentos Registrados
          </h3>
          
          {isLoading ? (
            <div className="text-center py-10">Cargando alimentos...</div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foods.map((food) => (
                <Card key={food.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow group flex flex-row items-center h-32">
                  <div className="w-32 h-full bg-muted relative flex-shrink-0 flex items-center justify-center">
                    {food.imageUrl ? (
                      <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
                    ) : (
                      <Utensils className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base line-clamp-1" title={food.name}>{food.name}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(food.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-orange-600 flex items-center gap-1">
                        {food.calories} kcal
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs py-0 h-5">
                          {food.protein}g P
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-xs py-0 h-5">
                          {food.carbs}g C
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 text-xs py-0 h-5">
                          {food.fats}g G
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-transparent shadow-none">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Info className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>No hay alimentos registrados en la base de datos.</p>
                <p className="text-sm">Usa el formulario de arriba para agregar el primero.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
