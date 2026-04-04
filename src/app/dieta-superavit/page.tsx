import Link from "next/link";
import { ArrowLeft, TrendingUp, Utensils, Calculator, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function DietaSuperavitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Dieta en Superávit Calórico
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Guía completa para ganar masa muscular de forma efectiva y saludable
          </p>
        </div>

        {/* Introducción */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  ¿Qué es el Superávit Calórico?
                </h2>
                <p className="text-gray-300 mb-4">
                  Un superávit calórico significa consumir más calorías de las que tu cuerpo gasta diariamente. 
                  Este excedente energético es fundamental para construir masa muscular, ya que proporciona 
                  los recursos necesarios para la síntesis de proteínas y el crecimiento del tejido muscular.
                </p>
                <p className="text-gray-300">
                  Sin embargo, no se trata solo de comer más, sino de hacerlo de manera inteligente para 
                  maximizar la ganancia muscular y minimizar el aumento de grasa corporal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cálculo de Calorías */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Cómo Calcular tu Superávit
            </h2>
          </div>

          <div className="space-y-6">
            {/* Paso 1 */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">Calcula tu Metabolismo Basal (TMB)</h3>
                  <p className="text-gray-300 mb-4">
                    Es la cantidad de calorías que tu cuerpo necesita en reposo. Usa la fórmula de Mifflin-St Jeor:
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg space-y-2">
                    <p className="text-cyan-300 font-mono">Hombres: TMB = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) + 5</p>
                    <p className="text-pink-300 font-mono">Mujeres: TMB = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) - 161</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-3">Multiplica por tu Factor de Actividad</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <p className="text-gray-300"><span className="font-semibold text-purple-300">Sedentario (poco o ningún ejercicio):</span> TMB × 1.2</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <p className="text-gray-300"><span className="font-semibold text-purple-300">Ligeramente activo (1-3 días/semana):</span> TMB × 1.375</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <p className="text-gray-300"><span className="font-semibold text-purple-300">Moderadamente activo (3-5 días/semana):</span> TMB × 1.55</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <p className="text-gray-300"><span className="font-semibold text-purple-300">Muy activo (6-7 días/semana):</span> TMB × 1.725</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <p className="text-gray-300"><span className="font-semibold text-purple-300">Extremadamente activo (2 veces al día):</span> TMB × 1.9</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-green transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-3">Añade el Superávit</h3>
                  <p className="text-gray-300 mb-4">
                    Suma entre 300-500 calorías adicionales a tu gasto calórico total diario (TDEE). 
                    Este rango permite un crecimiento muscular óptimo sin acumular exceso de grasa.
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-green-300 font-semibold">Calorías para Superávit = TDEE + 300-500 kcal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Distribución de Macronutrientes */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Distribución de Macronutrientes
            </h2>
            <p className="text-lg text-gray-300">
              La calidad de las calorías es tan importante como la cantidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Proteínas */}
            <div className="p-6 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-pink-400 mb-3">Proteínas</h3>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                1.8-2.2g
              </div>
              <p className="text-gray-400 mb-4">por kg de peso corporal</p>
              <p className="text-sm text-gray-300">
                Esencial para la síntesis muscular. Distribuye en 4-6 comidas al día para optimizar la absorción.
              </p>
            </div>

            {/* Carbohidratos */}
            <div className="p-6 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Carbohidratos</h3>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                4-6g
              </div>
              <p className="text-gray-400 mb-4">por kg de peso corporal</p>
              <p className="text-sm text-gray-300">
                Fuente principal de energía. Prioriza complejos (avena, arroz, patatas) sobre simples.
              </p>
            </div>

            {/* Grasas */}
            <div className="p-6 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-3">Grasas</h3>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                0.8-1g
              </div>
              <p className="text-gray-400 mb-4">por kg de peso corporal</p>
              <p className="text-sm text-gray-300">
                Vital para hormonas. Enfócate en grasas saludables: aguacate, frutos secos, aceite de oliva.
              </p>
            </div>
          </div>
        </section>

        {/* Ejemplo de Plan */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Ejemplo de Plan Diario (3000 kcal)
            </h2>
            <p className="text-lg text-gray-300">
              Para una persona de 75kg con objetivo de ganancia muscular
            </p>
          </div>

          <div className="space-y-4">
            {[
              { meal: "Desayuno", time: "8:00 AM", foods: "4 huevos, 100g avena, 1 plátano, 30g frutos secos", cals: "650 kcal" },
              { meal: "Media Mañana", time: "11:00 AM", foods: "Batido: 40g proteína whey, 1 manzana, 30g mantequilla de maní", cals: "450 kcal" },
              { meal: "Almuerzo", time: "2:00 PM", foods: "200g pollo, 150g arroz, verduras, 1 cda aceite de oliva", cals: "750 kcal" },
              { meal: "Pre-Entreno", time: "5:00 PM", foods: "100g pan integral, 50g pavo, 1 plátano", cals: "400 kcal" },
              { meal: "Post-Entreno", time: "7:30 PM", foods: "40g proteína whey, 80g dextrosa o maltodextrina", cals: "350 kcal" },
              { meal: "Cena", time: "9:00 PM", foods: "200g salmón, 200g patata, ensalada con aguacate", cals: "650 kcal" },
            ].map((meal, index) => (
              <div key={index} className="p-6 rounded-xl glass hover:bg-purple-500/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-orange-400">{meal.meal}</h3>
                      <span className="text-sm text-gray-500">{meal.time}</span>
                    </div>
                    <p className="text-gray-300">{meal.foods}</p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{meal.cals}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-orange-300">Total Diario:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">3,250 kcal</span>
            </div>
          </div>
        </section>

        {/* Consejos */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Consejos Clave para el Éxito
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-green-300">Sé consistente:</span> La ganancia muscular requiere tiempo. Mantén el superávit durante al menos 8-12 semanas.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-blue-300">Entrena con intensidad:</span> El superávit solo funciona si das a tu cuerpo una razón para construir músculo.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-purple-300">Monitorea tu progreso:</span> Pésate semanalmente. Un aumento de 0.25-0.5kg por semana es ideal.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-pink-300">Duerme bien:</span> 7-9 horas de sueño son cruciales para la recuperación y el crecimiento muscular.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-orange-300">Hidrátate:</span> Bebe al menos 3-4 litros de agua al día para optimizar el rendimiento y la recuperación.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl glass">
          <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h3>
          <p className="text-gray-300 mb-6">
            Registra tus comidas y progreso con nuestra plataforma
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-6 text-lg shadow-glow-pink transition-all duration-300 hover:scale-105">
              <TrendingUp className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
