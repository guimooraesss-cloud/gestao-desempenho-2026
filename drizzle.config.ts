import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // Isso aqui é o segredo para o Aiven funcionar:
    ssl: {
      rejectUnauthorized: false
    }
  },
});