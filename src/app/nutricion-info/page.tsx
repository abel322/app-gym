import Link from "next/link";
import { ArrowLeft, Zap, Building2, Shield, Droplet, Wheat, Apple, Fish, Heart, Brain, Activity } from "lucide-react";
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
            Los nutrientes se dividen en dos grandes grupos según la cantidad que necesitamos.
          </p>
        </div>

        {/* Macronutrientes Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              A. Macronutrientes (Los "Constructores y Proveedores de Energía")
            </h2>
            <p className="text-lg text-gray-300">
              Son los que aportan la energía (calorías) y forman la estructura de nuestro cuerpo. Se miden en gramos.
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
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Hidratos de Carbono (o Glúcidos)</h3>
                  <p className="text-gray-300 mb-4">
                    <span className="font-semibold">Función principal:</span> Son la fuente de energía preferida y más eficiente del cuerpo, especialmente para el cerebro y los músculos durante el ejercicio.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-4">
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">Clasificación:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <span className="font-semibold text-purple-300">Simples (Azúcares):</span>
                        <span className="text-gray-400"> Se absorben muy rápido, causan picos de glucosa en sangre. Ej: azúcar de mesa, jarabe de maíz, miel, fruta (fructosa). Su consumo debe ser moderado, especialmente los refinados.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <span className="font-semibold text-purple-300">Complejos (Almidones y fibra):</span>
                        <span className="text-gray-400"> Se absorben lentamente, proporcionan energía sostenida y generan saciedad. Ej: cereales integrales (avena, arroz integral), legumbres, patatas, tubérculos.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <span className="font-semibold text-green-300">La fibra:</span>
                        <span className="text-gray-400"> Es un tipo de carbohidrato complejo que no digerimos. Es crucial para la salud intestinal, el control del colesterol y la regulación del azúcar en sangre.</span>
                      </div>
                    </div>
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
                    <span className="font-semibold">Función principal:</span> Son los "ladrillos" del cuerpo. Son esenciales para la construcción y reparación de tejidos (músculos, piel, pelo, uñas), la formación de enzimas, hormonas y anticuerpos.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-pink-300">Estructura:</span>
                    <span className="text-gray-400"> Están formadas por cadenas de aminoácidos. Existen 20, de los cuales 9 son esenciales (el cuerpo no los fabrica y deben obtenerse de la dieta).</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-pink-300 mb-2">Fuentes:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                      <div>
                        <span className="font-semibold text-pink-300">Alto valor biológico:</span>
                        <span className="text-gray-400"> Contienen todos los aminoácidos esenciales en cantidades adecuadas. Ej: huevo, carne, pescado, leche y sus derivados.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                      <div>
                        <span className="font-semibold text-pink-300">Bajo valor biológico:</span>
                        <span className="text-gray-400"> Carecen de uno o más aminoácidos esenciales. Ej: legumbres, frutos secos, cereales. Se pueden combinar (ej: arroz con lentejas) para obtener un perfil completo.</span>
                      </div>
                    </div>
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
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Grasas (o Lípidos)</h3>
                  <p className="text-gray-300 mb-4">
                    <span className="font-semibold">Función principal:</span> Son la fuente de energía más concentrada. Son esenciales para la absorción de vitaminas (A, D, E, K), la formación de membranas celulares, el aislamiento térmico y la producción de hormonas.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-4">
                <h4 className="font-bold text-orange-300 mb-2">Clasificación:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <span className="font-semibold text-green-300">Insaturadas (Grasas "buenas"):</span>
                      <span className="text-gray-400"> Líquidas a temperatura ambiente. Son cardiosaludables. Ej: aceite de oliva, aguacate, frutos secos, pescado azul (rico en omega-3, con potente acción antiinflamatoria).</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <span className="font-semibold text-yellow-300">Saturadas:</span>
                      <span className="text-gray-400"> Sólidas a temperatura ambiente. Su consumo en exceso se asocia a un aumento del colesterol LDL ("malo"). Ej: mantequilla, carne grasa, piel de pollo, aceite de coco.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <span className="font-semibold text-red-300">Trans (Grasas "malas"):</span>
                      <span className="text-gray-400"> Son las más dañinas. Se crean industrialmente para dar textura y durabilidad a los alimentos. Aumentan el LDL y disminuyen el HDL ("bueno"). Ej: bollería industrial, margarinas duras, alimentos fritos y procesados.</span>
                    </div>
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
              B. Micronutrientes (Los "Reguladores")
            </h2>
            <p className="text-lg text-gray-300">
              No aportan energía (calorías), pero son imprescindibles para que las reacciones metabólicas ocurran. Se miden en miligramos o microgramos.
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
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Vitaminas</h3>
                  <p className="text-gray-300 mb-4">
                    Compuestos orgánicos (de origen vegetal o animal). Actúan como coenzimas, facilitando las reacciones químicas.
                  </p>
                </div>
              </div>
              <div className="ml-18 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-blue-300">Hidrosolubles:</span>
                    <span className="text-gray-400"> (Grupo B y C). Se disuelven en agua y el exceso se excreta por la orina. Necesitan un consumo regular.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-cyan-300">Liposolubles:</span>
                    <span className="text-gray-400"> (A, D, E, K). Se disuelven en grasas y se almacenan en el tejido adiposo. Un exceso puede ser tóxico.</span>
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
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Minerales</h3>
                  <p className="text-gray-300 mb-4">
                    Compuestos inorgánicos. Cumplen funciones estructurales (calcio en huesos) y de regulación (hierro en la hemoglobina, sodio y potasio en el impulso nervioso).
                  </p>
                </div>
              </div>
              <div className="ml-18">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-cyan-300">Ejemplos clave:</span>
                    <span className="text-gray-400"> Calcio, hierro, zinc, magnesio, potasio, yodo, selenio.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calidad Nutricional */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  3. El Concepto de Calidad Nutricional
                </h2>
                <p className="text-gray-300 mb-4">
                  No todas las calorías son iguales. Una caloría de un refresco azucarado y una de una almendra tienen efectos biológicos radicalmente diferentes.
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-green-300">Densidad Nutricional:</span>
                    <span className="text-gray-400"> Es el ratio de micronutrientes (vitaminas, minerales, fibra) por cada 100 calorías de un alimento. Una dieta óptima se basa en alimentos de alta densidad nutricional (verduras, frutas, proteínas magras, grasas saludables) y limita aquellos de baja densidad nutricional (bollería, bebidas azucaradas, harinas refinadas), conocidos como "calorías vacías".</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Microbioma */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  4. Más Allá de los Nutrientes: El Ecosistema Intestinal
                </h2>
                <p className="text-gray-300 mb-4">
                  Un aspecto profundo de la nutrición moderna es el papel del <span className="font-semibold text-purple-300">microbioma intestinal</span>: los billones de bacterias, hongos y virus que habitan nuestro tracto digestivo.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p className="text-gray-400">No solo digieren la fibra que nosotros no podemos, produciendo ácidos grasos de cadena corta que nutren nuestras células intestinales y tienen efectos antiinflamatorios.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                    <p className="text-gray-400">Modulan nuestro sistema inmunológico (cerca del 70-80% de nuestras células inmunes residen en el intestino).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p className="text-gray-400">Producen neurotransmisores como la serotonina (el "eje intestino-cerebro").</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                    <p className="text-gray-400">Una dieta rica en fibra (vegetales, frutas, legumbres) y alimentos fermentados promueve una microbiota diversa y saludable. Una dieta alta en azúcares y ultraprocesados la empobrece, asociándose a inflamación crónica y enfermedades metabólicas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enfoque Integrativo */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  5. La Nutrición en Contexto: Un Enfoque Integrativo
                </h2>
                <p className="text-gray-300 mb-4">
                  Una explicación profunda no puede ignorar que la nutrición óptima es individual y dinámica.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-blue-300 mb-2">Bioindividualidad:</h4>
                    <p className="text-gray-400">No existe una dieta perfecta para todos. Factores como la genética, la edad, el sexo, el nivel de actividad física, el estado de salud (ej: diabetes, hipertensión) y la composición de la microbiota dictan necesidades diferentes.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-300 mb-2">Horarios y Ritmos Circadianos:</h4>
                    <p className="text-gray-400">No solo importa qué comes, sino cuándo. Nuestro metabolismo está sincronizado con el ciclo de luz solar. La sensibilidad a la insulina es mayor por la mañana y menor por la noche. Comer en horarios regulares y dejar un ayuno nocturno (ej: no cenar justo antes de dormir) optimiza la función metabólica.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-pink-300 mb-2">El Aspecto Psicológico:</h4>
                    <p className="text-gray-400">La relación con la comida es fundamental. La alimentación restrictiva, la culpa o la ansiedad pueden activar el estrés crónico, que a su vez afecta negativamente la digestión, la absorción de nutrientes y las hormonas que regulan el apetito (leptina y grelina).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusión */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl glass">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-6">
              Conclusión: Principios para una Nutrición Óptima
            </h2>
            <p className="text-gray-300 mb-6">
              Más que obsesionarse con un nutriente aislado, una nutrición profunda y saludable se basa en principios:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-pink-300">Priorizar alimentos reales sobre ultraprocesados.</span> Cuanto menos ingredientes en la etiqueta y más reconocibles, mejor.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-orange-300">Buscar la variedad y el color.</span> Diferentes colores en frutas y verduras representan diferentes tipos de fitonutrientes (compuestos bioactivos con propiedades antioxidantes y antiinflamatorias).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-yellow-300">Asegurar un adecuado consumo de proteínas de calidad y fibra.</span> Son los dos nutrientes más saciantes y esenciales para la reparación y el buen funcionamiento intestinal.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-green-300">Incluir fuentes de grasas saludables (especialmente omega-3)</span> para modular la inflamación y la salud hormonal.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-blue-300">Hidratarse adecuadamente.</span> El agua es el medio de todas las reacciones bioquímicas.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p className="text-gray-300"><span className="font-semibold text-purple-300">Cocinar en casa.</span> Es la forma más efectiva de tener control real sobre los ingredientes, las cantidades y las técnicas de cocción.</p>
              </div>
            </div>
            <p className="text-lg text-gray-200 mt-6 italic">
              En esencia, la nutrición no es solo combustible; es información molecular que le dice a tu cuerpo cómo funcionar, cómo expresar sus genes y cómo envejecer. Entender esto es el primer paso para construir una salud duradera.
            </p>
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
