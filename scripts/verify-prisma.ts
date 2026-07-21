import "dotenv/config";
import { prisma } from "../lib/prisma";

async function verify() {
  await prisma.plan.findFirst({ select: { id: true } });
  console.log("✅ Connected");
}

verify()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
