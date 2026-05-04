import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully!");
    
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
