// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Fruits" },
        { name: "Vegetables" },
        { name: "Dairy" },
        { name: "Meat" },
        { name: "Fish" },
        { name: "Bakery" },
      ],
    });
    console.log("Categories created successfully");
  } catch (err) {
    console.log("[SEED  ERROR]: ", err);
  } finally {
    await database.$disconnect();
  }
}

main();
