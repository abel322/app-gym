import Link from "next/link";
import { Dumbbell, Apple, TrendingUp, Users, Zap, Heart, Salad, Beef, Droplet, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-grid-pattern pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-float">
              FitTrack Pro
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 font-light">
              Transforma tu cuerpo, transforma tu vida
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            La plataforma definitiva para alcanzar tus objetivos de fitness. 
            Entrena inteligentemente, come saludablemente, vive plenamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-glow-purple transition-all duration-300 hover:scale-105">
                <Zap className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="border-2 border-purple-500 bg-transparent hover:bg-purple-500/20 px-8 py-6 text-lg text-white backdrop-blur-sm transition-all duration-300 hover:scale-105">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm text-gray-400">Usuarios Activos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-400">Entrenamientos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">95%</div>
              <div className="text-sm text-gray-400">Satisfacción</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="entrenamientos" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-400">Herramientas profesionales para resultados extraordinarios</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow-purple">
                  <Dumbbell className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Entrenamientos Personalizados</h3>
                <p className="text-gray-400">
                  Rutinas diseñadas específicamente para tus objetivos. Desde principiante hasta avanzado, 
                  con seguimiento detallado de cada ejercicio y progreso.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-glow-pink">
                  <Apple className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Nutrición Inteligente</h3>
                <p className="text-gray-400">
                  Planes nutricionales adaptados a tu metabolismo. Calcula macros, registra comidas 
                  y alcanza tus metas con alimentación balanceada y deliciosa.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-glow-blue">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Análisis de Progreso</h3>
                <p className="text-gray-400">
                  Visualiza tu evolución con gráficos detallados. Mediciones corporales, 
                  fuerza ganada, calorías quemadas y predicciones basadas en IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Section */}
      <section id="nutricion" className="py-24 px-4 relative bg-gradient-to-b from-transparent via-pink-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Nutrición que funciona
            </h2>
            <p className="text-xl text-gray-400">Alimenta tu cuerpo con inteligencia</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Come bien, vive mejor</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                La nutrición es el 70% de tu éxito. Nuestro sistema calcula tus necesidades 
                calóricas y de macronutrientes basándose en tu objetivo, nivel de actividad y metabolismo.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Beef className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Cálculo de macros personalizado</div>
                    <div className="text-gray-400">Proteínas, carbohidratos y grasas optimizados para ti</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Salad className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Base de datos de alimentos</div>
                    <div className="text-gray-400">Miles de alimentos con información nutricional completa</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Droplet className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Seguimiento de hidratación</div>
                    <div className="text-gray-400">Mantén tu cuerpo hidratado para máximo rendimiento</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Beef className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">150g</div>
                <div className="text-sm text-gray-400">Proteína diaria</div>
              </div>
              <div className="p-6 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <Cookie className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">250g</div>
                <div className="text-sm text-gray-400">Carbohidratos</div>
              </div>
              <div className="p-6 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Salad className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">60g</div>
                <div className="text-sm text-gray-400">Grasas saludables</div>
              </div>
              <div className="p-6 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Droplet className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">3L</div>
                <div className="text-sm text-gray-400">Agua al día</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/nutricion-info">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-10 py-6 text-lg shadow-glow-pink transition-all duration-300 hover:scale-105">
                <Apple className="mr-2 h-5 w-5" />
                Aprende más sobre nutrición
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="progreso" className="py-24 px-4 relative bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Entrena con propósito
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                No más entrenamientos sin rumbo. Cada repetición cuenta, cada comida importa. 
                Nuestra tecnología te guía paso a paso hacia la mejor versión de ti mismo.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Seguimiento en tiempo real</div>
                    <div className="text-gray-400">Monitorea cada métrica importante para tu éxito</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Comunidad motivadora</div>
                    <div className="text-gray-400">Conecta con personas que comparten tus objetivos</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Resultados garantizados</div>
                    <div className="text-gray-400">Metodología probada por miles de usuarios exitosos</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden glass p-8 shadow-glow-purple">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-400">Calorías quemadas hoy</div>
                      <div className="text-3xl font-bold">2,450</div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
                      <Zap className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-600/20 to-orange-600/20 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-400">Proteína consumida</div>
                      <div className="text-3xl font-bold">145g</div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center animate-pulse-glow">
                      <Apple className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-400">Entrenamientos esta semana</div>
                      <div className="text-3xl font-bold">5/6</div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
                      <Dumbbell className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Comienza tu transformación hoy
          </h2>
          <p className="text-xl text-gray-300">
            Únete a miles de personas que ya están alcanzando sus objetivos
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-8 text-xl shadow-glow-purple transition-all duration-300 hover:scale-110">
              <Zap className="mr-2 h-6 w-6" />
              Empezar Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 FitTrack Pro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
