import Link from "next/link";
import { ArrowLeft, Scale, Ruler, TrendingUp, Calendar, Camera, LineChart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function MedicionesProgresoPage() {
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
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Mediciones y Seguimiento de Progreso
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Aprende a medir tu progreso correctamente durante una fase de superávit calórico
          </p>
        </div>

        {/* Introducción */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LineChart className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  ¿Por qué es importante medir el progreso?
                </h2>
                <p className="text-gray-300 mb-4">
                  Durante una fase de superávit, el objetivo es ganar masa muscular minimizando el aumento de grasa. 
                  Sin un seguimiento adecuado, es fácil excederse y acumular más grasa de la deseada, o quedarse corto 
                  y no proporcionar suficiente energía para el crecimiento muscular.
                </p>
                <p className="text-gray-300">
                  Las mediciones regulares te permiten ajustar tu dieta y entrenamiento en tiempo real, 
                  asegurando que estás en el camino correcto hacia tus objetivos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Métodos de Medición */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Métodos de Medición Esenciales
            </h2>
          </div>

          <div className="space-y-6">
            {/* Peso Corporal */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-400 mb-3">1. Peso Corporal Semanal</h3>
                  <p className="text-gray-300 mb-4">
                    El peso es el indicador más básico pero fundamental. Sin embargo, debe interpretarse correctamente.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-purple-300 mb-2">Protocolo de Pesaje:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Pésate a la misma hora cada día (idealmente al despertar, después de ir al baño, en ayunas)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Usa la misma báscula y en las mismas condiciones</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Registra el peso diario y calcula el promedio semanal</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Compara promedios semanales, no días individuales</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-bold text-pink-300 mb-2">Tasa de Ganancia Ideal:</h4>
                      <div className="space-y-2">
                        <p className="text-gray-300"><span className="font-semibold text-pink-300">Principiantes:</span> 0.5-1% del peso corporal por semana (0.4-0.8 kg para 80kg)</p>
                        <p className="text-gray-300"><span className="font-semibold text-pink-300">Intermedios:</span> 0.25-0.5% del peso corporal por semana (0.2-0.4 kg para 80kg)</p>
                        <p className="text-gray-300"><span className="font-semibold text-pink-300">Avanzados:</span> 0.1-0.25% del peso corporal por semana (0.1-0.2 kg para 80kg)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medidas Corporales */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Ruler className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">2. Circunferencias Corporales</h3>
                  <p className="text-gray-300 mb-4">
                    Las medidas con cinta métrica revelan dónde estás ganando tamaño y te ayudan a distinguir entre músculo y grasa.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-blue-300 mb-2">Puntos de Medición Clave:</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Cuello</p>
                          <p className="text-sm text-gray-400">Justo debajo de la nuez de Adán</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Hombros</p>
                          <p className="text-sm text-gray-400">Parte más ancha de los deltoides</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Pecho</p>
                          <p className="text-sm text-gray-400">A la altura de los pezones, relajado</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Cintura</p>
                          <p className="text-sm text-gray-400">A la altura del ombligo</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Cadera</p>
                          <p className="text-sm text-gray-400">Parte más ancha de los glúteos</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Brazos</p>
                          <p className="text-sm text-gray-400">Bíceps flexionado, punto más alto</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Muslos</p>
                          <p className="text-sm text-gray-400">Parte más ancha, pierna relajada</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="font-semibold text-cyan-300 mb-1">Pantorrillas</p>
                          <p className="text-sm text-gray-400">Parte más ancha del gemelo</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-300 mb-2">Frecuencia: Cada 2 semanas</h4>
                      <p className="text-gray-300">Mide siempre en las mismas condiciones (misma hora, mismo día de la semana, misma tensión en la cinta)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fotos de Progreso */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-pink-400 mb-3">3. Fotografías de Progreso</h3>
                  <p className="text-gray-300 mb-4">
                    Las fotos son el método más honesto. Los cambios visuales a menudo son más reveladores que los números.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-pink-300 mb-2">Protocolo Fotográfico:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                          <p className="text-gray-400"><span className="font-semibold text-pink-300">Frecuencia:</span> Cada 2-4 semanas</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                          <p className="text-gray-400"><span className="font-semibold text-pink-300">Iluminación:</span> Misma luz natural o artificial, evita sombras dramáticas</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                          <p className="text-gray-400"><span className="font-semibold text-pink-300">Ángulos:</span> Frontal relajado, frontal flexionado, lateral, espalda</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                          <p className="text-gray-400"><span className="font-semibold text-pink-300">Hora:</span> Misma hora del día (idealmente en ayunas por la mañana)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                          <p className="text-gray-400"><span className="font-semibold text-pink-300">Ropa:</span> Usa la misma ropa ajustada o ropa interior</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rendimiento en el Gimnasio */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-green transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-400 mb-3">4. Progresión de Fuerza</h3>
                  <p className="text-gray-300 mb-4">
                    El aumento de fuerza es un indicador directo de que estás ganando músculo funcional.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-green-300 mb-2">Qué Registrar:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Peso levantado en ejercicios compuestos (sentadilla, press banca, peso muerto, press militar)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Número de repeticiones con el mismo peso</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <p className="text-gray-400">Volumen total semanal (series × repeticiones × peso)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                      <p className="text-gray-300"><span className="font-semibold text-green-300">Señal positiva:</span> Si tu fuerza aumenta consistentemente, estás en superávit adecuado y ganando músculo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratio Cintura-Cadera */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                  Método del Ratio Cintura-Cadera
                </h2>
                <p className="text-gray-300 mb-4">
                  Este método te ayuda a identificar si estás ganando más músculo que grasa durante el superávit.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-orange-300 mb-2">Cómo Calcularlo:</h4>
                    <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
                      <p className="text-orange-300 font-mono text-lg">Ratio = Circunferencia de Cintura ÷ Circunferencia de Cadera</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-yellow-300 mb-2">Interpretación:</h4>
                    <div className="space-y-3">
                      <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <p className="text-green-300 font-semibold mb-1">✓ Ratio se mantiene o disminuye ligeramente</p>
                        <p className="text-gray-300">Estás ganando músculo en proporción adecuada. La grasa se distribuye uniformemente.</p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                        <p className="text-yellow-300 font-semibold mb-1">⚠ Ratio aumenta moderadamente</p>
                        <p className="text-gray-300">Estás ganando algo de grasa abdominal. Considera reducir ligeramente el superávit (50-100 kcal).</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p className="text-red-300 font-semibold mb-1">✗ Ratio aumenta significativamente</p>
                        <p className="text-gray-300">Estás acumulando demasiada grasa abdominal. Reduce el superávit o considera una mini-fase de déficit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabla de Seguimiento */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Plantilla de Seguimiento Semanal
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div className="glass rounded-2xl p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-4 px-4 text-purple-400 font-bold">Métrica</th>
                    <th className="text-left py-4 px-4 text-pink-400 font-bold">Frecuencia</th>
                    <th className="text-left py-4 px-4 text-blue-400 font-bold">Objetivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/20">
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-purple-300">Peso Corporal</td>
                    <td className="py-4 px-4 text-gray-300">Diario (promedio semanal)</td>
                    <td className="py-4 px-4 text-gray-300">+0.25-0.5% por semana</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-pink-300">Circunferencias</td>
                    <td className="py-4 px-4 text-gray-300">Cada 2 semanas</td>
                    <td className="py-4 px-4 text-gray-300">Aumento en brazos, pecho, piernas</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-blue-300">Ratio Cintura/Cadera</td>
                    <td className="py-4 px-4 text-gray-300">Cada 2 semanas</td>
                    <td className="py-4 px-4 text-gray-300">Mantener o disminuir</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-green-300">Fotografías</td>
                    <td className="py-4 px-4 text-gray-300">Cada 2-4 semanas</td>
                    <td className="py-4 px-4 text-gray-300">Cambios visuales positivos</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-orange-300">Fuerza</td>
                    <td className="py-4 px-4 text-gray-300">Cada entrenamiento</td>
                    <td className="py-4 px-4 text-gray-300">Progresión constante</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Señales de Alerta */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
              Señales de que Debes Ajustar tu Superávit
            </h2>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-300 mb-2">Superávit Excesivo (reduce calorías):</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">Ganas más de 0.5-1% de peso corporal por semana</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">La cintura crece más rápido que el pecho y los brazos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">Pérdida visible de definición muscular en fotos</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <h4 className="font-bold text-yellow-300 mb-2">Superávit Insuficiente (aumenta calorías):</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">Peso estancado durante 2-3 semanas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">No hay progresión de fuerza en el gimnasio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">Fatiga constante y recuperación lenta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl glass">
          <h3 className="text-3xl font-bold mb-4">¿Listo para rastrear tu progreso?</h3>
          <p className="text-gray-300 mb-6">
            Usa nuestra plataforma para registrar todas tus mediciones y visualizar tu evolución
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-6 text-lg shadow-glow-blue transition-all duration-300 hover:scale-105">
              <Calendar className="mr-2 h-5 w-5" />
              Comenzar a Medir
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
