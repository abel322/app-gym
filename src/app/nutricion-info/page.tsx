import Link from "next/link";
import { ArrowLeft, Zap, Building2, Shield, Droplet, Wheat, Apple, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function NutricionInfoPage() {
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
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Guía Completa de Nutrición
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Para entender qué necesita el cuerpo humano para funcionar, los nutrientes se dividen en dos grandes grupos: 
            <span className="text-pink-400 font-semibold"> Macronutrientes</span> (los que necesitamos en grandes cantidades para obtener energía y estructura) y 
            <span className="text-orange-400 font-semibold"> Micronutrientes</span> (los que necesitamos en cantidades pequeñas para regular procesos químicos).
          </p>
        </div>

        {/* Macronutrientes Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              1. Macronutrientes
            </h2>
            <p className="text-lg text-gray-300">
              Son la base de la dieta y se miden en gramos.
            </p>
          </div>

          <div className="space-y-6">
            {/* Carbohidratos */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Carbohidratos (Glúcidos)</h3>
                  <p className="text-gray-300 mb-4">
                    Son la fuente de energía principal y más rápida para el cerebro y los músculos.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-purple-300">Simples:</span>
                    <span className="text-gray-400"> Azúcares (frutas, miel).</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-purple-300">Complejos:</span>
                    <span className="text-gray-400"> Almidones y fibra (cereales integrales, legumbres, tubérculos).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proteínas */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-pink transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-2">Proteínas</h3>
                  <p className="text-gray-300 mb-4">
                    Son los "ladrillos" del cuerpo. Forman músculos, piel, órganos, hormonas y anticuerpos.
                  </p>
                </div>
              </div>
              <div className="ml-18">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-pink-300">Fuentes:</span>
                    <span className="text-gray-400"> Carnes, pescados, huevos, lácteos, soja, granos y frutos secos.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grasas */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Droplet className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Grasas (Lípidos)</h3>
                  <p className="text-gray-300 mb-4">
                    Son una reserva de energía concentrada, protegen los órganos y permiten la absorción de ciertas vitaminas.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-green-300">Saludables:</span>
                    <span className="text-gray-400"> Aceite de oliva, aguacate, omega-3 (pescados).</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-red-300">A limitar:</span>
                    <span className="text-gray-400"> Grasas saturadas y trans (frituras, bollería).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Micronutrientes Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              2. Micronutrientes
            </h2>
            <p className="text-lg text-gray-300">
              Aunque se necesitan en miligramos o microgramos, su ausencia puede causar enfermedades graves.
            </p>
          </div>

          <div className="space-y-6">
            {/* Vitaminas */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Apple className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Vitaminas (Orgánicas)</h3>
                  <p className="text-gray-300 mb-4">
                    Ayudan a que las reacciones químicas del cuerpo ocurran correctamente.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-blue-300">Hidrosolubles</span>
                    <span className="text-gray-400"> (se disuelven en agua): Vitamina C y el Complejo B. Se deben consumir a diario porque el cuerpo no las almacena.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-cyan-300">Liposolubles</span>
                    <span className="text-gray-400"> (se almacenan en grasa): Vitaminas A, D, E y K. Son vitales para la vista, los huesos y la coagulación.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minerales */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Minerales (Inorgánicos)</h3>
                  <p className="text-gray-300 mb-4">
                    Forman parte de estructuras como los huesos o ayudan a transmitir impulsos eléctricos.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-cyan-300">Macrominerales:</span>
                    <span className="text-gray-400"> Calcio, Magnesio, Fósforo, Potasio, Sodio y Cloro.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-purple-300">Oligoelementos:</span>
                    <span className="text-gray-400"> Hierro, Zinc, Yodo, Selenio y Flúor.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nutrientes Esenciales No Energéticos */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              3. Nutrientes Esenciales No Energéticos
            </h2>
            <p className="text-lg text-gray-300">
              Aunque no aportan calorías, la vida es imposible sin ellos:
            </p>
          </div>

          <div className="space-y-6">
            {/* Agua */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-blue transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Droplet className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Agua</h3>
                  <p className="text-gray-300">
                    Es el solvente universal del cuerpo. Transporta nutrientes, regula la temperatura y elimina desechos.
                  </p>
                </div>
              </div>
            </div>

            {/* Fibra */}
            <div className="p-8 rounded-2xl glass hover:shadow-glow-purple transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wheat className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Fibra</h3>
                  <p className="text-gray-300">
                    Técnicamente es un carbohidrato que no digerimos, pero es esencial para la salud digestiva y el control del azúcar en sangre.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen Table */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
            Resumen de Funciones
          </h2>
          
          <div className="overflow-x-auto">
            <div className="glass rounded-2xl p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-4 px-4 text-purple-400 font-bold text-lg">Nutriente</th>
                    <th className="text-left py-4 px-4 text-pink-400 font-bold text-lg">Función Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/20">
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-purple-300">Carbohidratos</td>
                    <td className="py-4 px-4 text-gray-300">Energía inmediata</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-pink-300">Proteínas</td>
                    <td className="py-4 px-4 text-gray-300">Estructura y reparación</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-orange-300">Grasas</td>
                    <td className="py-4 px-4 text-gray-300">Energía de reserva y hormonas</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-blue-300">Vitaminas/Minerales</td>
                    <td className="py-4 px-4 text-gray-300">Regulación y defensa</td>
                  </tr>
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-cyan-300">Agua</td>
                    <td className="py-4 px-4 text-gray-300">Transporte y limpieza</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl glass">
          <h3 className="text-3xl font-bold mb-4">¿Listo para optimizar tu nutrición?</h3>
          <p className="text-gray-300 mb-6">
            Comienza a rastrear tus macros y micronutrientes con nuestra plataforma
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-10 py-6 text-lg shadow-glow-pink transition-all duration-300 hover:scale-105">
              <Fish className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
