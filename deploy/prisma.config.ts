import "dotenv/config";
import { defineConfig } from "prisma/config";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  schema: isVercel ? "prisma/schema.vercel.prisma" : "prisma/schema.prisma",
  migrations: {
    path: isVercel ? "prisma/migrations-vercel" : "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
