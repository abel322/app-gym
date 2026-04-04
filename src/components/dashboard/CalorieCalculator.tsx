"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Zap } from "lucide-react";

interface CalorieResult {
  bmr: number;
  tdee: number;
  surplus: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function CalorieCalculator() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "MALE",
    activityLevel: "MODERATELY_ACTIVE",
    goal: "GAIN_MUSCLE",
  });
  
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculateCalories = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    if (!weight || !height || !age) return;

    // Mifflin-St Jeor Formula
    let bmr: number;
    if (formData.gender === "MALE") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9,
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel];
    
    // Surplus for muscle gain (300-500 kcal)
    const surplus = tdee + 400;

    // Macros calculation
    const protein = weight * 2.0; // 2g per kg
    const fat = weight * 1.0; // 1g per kg
    const proteinCals = protein * 4;
    const fatCals = fat * 9;
    const carbsCals = surplus - proteinCals - fatCals;
    const carbs = carbsCals / 4;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      surplus: Math.round(surplus),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculadora de Calorías para Superávit
        </CardTitle>
        <CardDescription>
          Calcula tus necesidades calóricas y macros para ganar masa muscular
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="75"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="175"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="25"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculino</SelectItem>
                <SelectItem value="FEMALE">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activityLevel">Nivel de Actividad</Label>
            <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEDENTARY">Sedentario (poco ejercicio)</SelectItem>
                <SelectItem value="LIGHTLY_ACTIVE">Ligeramente activo (1-3 días/semana)</SelectItem>
                <SelectItem value="MODERATELY_ACTIVE">Moderadamente activo (3-5 días/semana)</SelectItem>
                <SelectItem value="VERY_ACTIVE">Muy activo (6-7 días/semana)</SelectItem>
                <SelectItem value="EXTRA_ACTIVE">Extra activo (atleta)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateCalories} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
          <Zap className="mr-2 h-4 w-4" />
          Calcular
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-muted-foreground mb-1">Metabolismo Basal (BMR)</p>
                <p className="text-2xl font-bold text-purple-400">{result.bmr} kcal</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-muted-foreground mb-1">Gasto Calórico Total (TDEE)</p>
                <p className="text-2xl font-bold text-blue-400">{result.tdee} kcal</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <p className="text-sm text-muted-foreground">Calorías para Superávit</p>
                </div>
                <p className="text-3xl font-bold text-green-400">{result.surplus} kcal/día</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Distribución de Macronutrientes:</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                  <p className="text-xl font-bold text-pink-400">{result.protein}g</p>
                  <p className="text-xs text-muted-foreground">{Math.round((result.protein * 4 / result.surplus) * 100)}%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-muted-foreground">Carbohidratos</p>
                  <p className="text-xl font-bold text-purple-400">{result.carbs}g</p>
                  <p className="text-xs text-muted-foreground">{Math.round((result.carbs * 4 / result.surplus) * 100)}%</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs text-muted-foreground">Grasas</p>
                  <p className="text-xl font-bold text-orange-400">{result.fat}g</p>
                  <p className="text-xs text-muted-foreground">{Math.round((result.fat * 9 / result.surplus) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
