import Link from "next/link";
import { ArrowLeft, Calculator, Dumbbell, TrendingUp, Calendar, CheckCircle, AlertCircle, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

export default function GuiaDashboardPage() {
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
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Guía del Dashboard
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Aprende a usar todas las funcionalidades del Dashboard de Superávit para maximizar tu ganancia muscular
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-yellow-400" />
                Inicio Rápido
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sigue estos pasos para comenzar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Completa tu perfil", desc: "Ingresa tu peso, altura, edad y objetivo" },
                  { step: 2, title: "Calcula tus calorías", desc: "Usa la calculadora para saber cuánto comer" },
                  { step: 3, title: "Revisa los ejercicios", desc: "Conoce tu rutina personalizada" },
                  { step: 4, title: "Registra tu primera semana", desc: "Toma tus mediciones iniciales" },
                  { step: 5, title: "Entrena y come", desc: "Sigue tu plan durante 1-2 semanas" },
                  { step: 6, title: "Ajusta según recomendaciones", desc: "El sistema te dirá si necesitas cambios" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dashboard Sections */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Secciones del Dashboard
          </h2>

          <div className="space-y-6">
            {/* Calculator */}
            <Card className="bg-slate-900/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  Calculadora de Calorías
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Calcula tus necesidades calóricas diarias para ganar masa muscular.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <h4 className="font-semibold text-blue-300 mb-2">¿Qué hace?</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Calcula tu Metabolismo Basal (BMR)</li>
                      <li>• Calcula tu Gasto Calórico Total (TDEE)</li>
                      <li>• Añade 400 kcal de superávit automáticamente</li>
                      <li>• Distribuye tus macronutrientes (proteínas, carbos, grasas)</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <h4 className="font-semibold text-green-300 mb-2">Cómo usarla:</h4>
                    <ol className="text-sm text-gray-400 space-y-1">
                      <li>1. Ingresa tu peso, altura y edad</li>
                      <li>2. Selecciona tu género</li>
                      <li>3. Elige tu nivel de actividad</li>
                      <li>4. Haz clic en "Calcular"</li>
                      <li>5. Anota tu objetivo de calorías diarias</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="bg-slate-900/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-pink-400" />
                  Ejercicios Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Rutina personalizada según tu género y objetivo.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-pink-500/10">
                    <h4 className="font-semibold text-pink-300 mb-2">Incluye:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Ejercicios compuestos fundamentales</li>
                      <li>• Ejercicios específicos por género</li>
                      <li>• Series, repeticiones y descansos</li>
                      <li>• División semanal sugerida</li>
                      <li>• Descripción de cada ejercicio</li>
                    </ul>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <h4 className="font-semibold text-blue-300 mb-2">👨 Para Hombres:</h4>
                      <p className="text-sm text-gray-400">Enfoque en pecho, espalda, brazos y fuerza general</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <h4 className="font-semibold text-purple-300 mb-2">👩 Para Mujeres:</h4>
                      <p className="text-sm text-gray-400">Enfoque en glúteos, piernas y tonificación</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking */}
            <Card className="bg-slate-900/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Seguimiento Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Registra tus mediciones semanales y recibe recomendaciones automáticas.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <h4 className="font-semibold text-green-300 mb-2">Qué registrar:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Peso corporal</li>
                      <li>• Circunferencia de pecho</li>
                      <li>• Circunferencia de cintura</li>
                      <li>• Circunferencia de cadera</li>
                      <li>• Circunferencia de bíceps</li>
                      <li>• Circunferencia de muslos</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10">
                    <h4 className="font-semibold text-yellow-300 mb-2">Recomendaciones Automáticas:</h4>
                    <p className="text-sm text-gray-400 mb-2">El sistema analiza tu progreso y te dice:</p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>✅ Si estás progresando bien</li>
                      <li>⚠️ Si necesitas aumentar calorías</li>
                      <li>❌ Si necesitas reducir calorías</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-8">
            Consejos para el Éxito
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Haz Esto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Mide siempre en las mismas condiciones (misma hora, en ayunas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Entrena 4-5 días por semana consistentemente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Come tus macros todos los días</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Duerme 7-9 horas cada noche</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Toma fotos de progreso cada 2-4 semanas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Sé paciente - los resultados toman tiempo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  Evita Esto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No hagas cambios drásticos en tu dieta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No te peses todos los días (usa promedio semanal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No hagas cardio excesivo (máximo 2-3 veces/semana)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No ignores las recomendaciones del sistema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No te compares con otros (cada cuerpo es diferente)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No te rindas si no ves cambios en 1-2 semanas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Expected Results */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Expectativas Realistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <h4 className="font-semibold text-purple-300 mb-2">Principiantes</h4>
                  <p className="text-2xl font-bold text-purple-400 mb-1">0.5-1%</p>
                  <p className="text-sm text-gray-400">del peso por semana</p>
                  <p className="text-xs text-gray-500 mt-2">0-1 año entrenando</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <h4 className="font-semibold text-pink-300 mb-2">Intermedios</h4>
                  <p className="text-2xl font-bold text-pink-400 mb-1">0.25-0.5%</p>
                  <p className="text-sm text-gray-400">del peso por semana</p>
                  <p className="text-xs text-gray-500 mt-2">1-3 años entrenando</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <h4 className="font-semibold text-blue-300 mb-2">Avanzados</h4>
                  <p className="text-2xl font-bold text-blue-400 mb-1">0.1-0.25%</p>
                  <p className="text-sm text-gray-400">del peso por semana</p>
                  <p className="text-xs text-gray-500 mt-2">3+ años entrenando</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-300 mb-2">Línea de Tiempo:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <span className="text-blue-400">2-4 semanas:</span> Primeros cambios (fuerza, energía)</li>
                  <li>• <span className="text-purple-400">8-12 semanas:</span> Cambios visibles en el espejo</li>
                  <li>• <span className="text-pink-400">6-12 meses:</span> Transformación notable</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl glass">
          <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-300 mb-6">
            Accede al dashboard y comienza tu transformación hoy
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Crear Cuenta
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 border-purple-500 bg-transparent hover:bg-purple-500/20 px-10 py-6 text-lg text-white">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
