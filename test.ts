import { PrismaClient } from "@prisma/client";

async function main() {
  const apiKey = process.env.EXERCISE_DB_API_KEY;
  const response = await fetch("https://exercisedb.p.rapidapi.com/exercises?limit=1", {
    headers: {
      "x-rapidapi-key": apiKey || "",
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    },
  });
  const data = await response.json();
  console.log(data);
}
main();
