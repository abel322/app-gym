import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Limpiando ejercicios generados por IA...");
    const deleted = await prisma.exercise.deleteMany({
        where: { id: { startsWith: "ai-" } }
    });
    console.log(`Borrados ${deleted.count} ejercicios de IA.`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
