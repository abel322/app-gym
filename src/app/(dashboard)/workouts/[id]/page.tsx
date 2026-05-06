import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Dumbbell, ArrowLeft, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default async function WorkoutDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const workout = await prisma.workout.findUnique({
    where: { 
      id: params.id,
      userId: session.user.id
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          weight: true,
          height: true,
          age: true,
          gender: true,
          activityLevel: true
        }
      }
    },
  });

  if (!workout) {
    notFound();
  }

  // Calculate surplus target
  let surplusTarget = 2639; // Fallback
  const u = workout.user;
  if (u?.weight && u?.height && u?.age && u?.gender) {
    let bmr = 10 * u.weight + 6.25 * u.height - 5 * u.age;
    bmr += u.gender === "MALE" ? 5 : -161;
    const ACTIVITY_MULTIPLIERS: Record<string, number> = {
      SEDENTARY: 1.2, LIGHTLY_ACTIVE: 1.375, MODERATELY_ACTIVE: 1.55, VERY_ACTIVE: 1.725, EXTRA_ACTIVE: 1.9,
    };
    const multiplier = ACTIVITY_MULTIPLIERS[u.activityLevel || "SEDENTARY"] || 1.2;
    const tdee = bmr * multiplier;
    surplusTarget = Math.round(tdee * 1.10); // +10% for surplus
  }

  const todayIndex = new Date().getDay();
  const currentDayName = todayIndex === 0 ? 'Domingo' : DIAS_SEMANA[todayIndex - 1];

  return (
    <DashboardLayout
      title="Cronograma Semanal"
      description="Planifica y registra tus entrenamientos para toda la semana"
    >
      <div className="space-y-6 pb-24">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href="/workouts">
            <Button variant="ghost" className="gap-2 hover:bg-muted/50">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          </Link>
        </div>

        {/* Info Banner (Surplus) */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-600">Objetivo Calórico (Hipertrofia)</p>
              <p className="text-xs text-muted-foreground">Calculado según tu perfil</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">{surplusTarget} kcal</p>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x lg:grid lg:grid-cols-7 lg:gap-4 lg:snap-none hide-scrollbar">
          {DIAS_SEMANA.map((dayName) => {
            const dayExercises = workout.exercises.filter(ex => ex.day === dayName);
            const isToday = dayName === currentDayName;
            
            return (
              <div 
                key={dayName} 
                className={`min-w-[280px] lg:min-w-0 snap-center flex-shrink-0 rounded-2xl p-3 flex flex-col h-[65vh] border transition-all ${
                  isToday ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-gray-50/80 dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'
                }`}
              >
                <div className="text-center mb-4">
                   <h3 className={`font-bold capitalize ${isToday ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                     {dayName}
                   </h3>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mb-3 border-dashed border-primary/40 text-primary hover:bg-primary/10 bg-white/50 dark:bg-black/50"
                >
                  <Plus className="h-4 w-4 mr-2" /> Añadir
                </Button>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-2 custom-scrollbar">
                  {dayExercises.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Dumbbell className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">Descanso</p>
                      <p className="text-xs">Sin entrenos</p>
                    </div>
                  ) : (
                    dayExercises.map(ex => (
                      <Card key={ex.id} className="p-3 flex items-center gap-3 shadow-sm bg-white dark:bg-black overflow-hidden border transition-colors hover:border-primary/50 cursor-pointer">
                        {ex.exercise.imageUrl ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 bg-muted border">
                            <Image src={ex.exercise.imageUrl} alt={ex.exercise.name} width={40} height={40} className="object-cover h-full w-full" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border">
                            <Dumbbell className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-foreground">{ex.exercise.name}</p>
                          <div className="text-[10px] font-bold text-primary bg-primary/10 inline-flex items-center px-2 py-0.5 rounded-full mt-1">
                            {ex.sets} {ex.sets === 1 ? 'serie' : 'series'}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t lg:pl-64 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Button className="w-full max-w-4xl mx-auto block bg-gradient-primary text-lg py-6 shadow-lg hover:shadow-xl transition-shadow font-semibold text-white">
            Guardar Cronograma Semanal
          </Button>
        </div>
      </div>
      
      {/* Scrollbar overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 20px; }
      `}} />
    </DashboardLayout>
  );
}
