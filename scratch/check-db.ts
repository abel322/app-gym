import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const measurements = await prisma.bodyMeasurement.findMany({
    include: {
      user: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  console.log("Total measurements found:", measurements.length);
  measurements.forEach((m) => {
    console.log(`ID: ${m.id}, User: ${m.user.name} (${m.user.email}), Date: ${m.date}, Weight: ${m.weight}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
