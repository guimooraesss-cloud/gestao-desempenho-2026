import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc"; // Removemos as travas de segurança
import { z } from "zod";
import * as db from "./db";

// --- SEU CRACHÁ VIP (Bypass) ---
const MOCK_USER = {
  id: 1,
  username: "Gui Master",
  role: "master", // Isso te dá poderes totais no sistema
  avatarUrl: null
};

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    // A mágica acontece aqui: O sistema sempre vai achar que você está logado!
    me: publicProcedure.query(() => MOCK_USER),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      // O logout vira apenas visual, já que você é o dono
      return { success: true } as const;
    }),
  }),

  // Positions (Cargos) - Tudo liberado (publicProcedure)
  positions: router({
    list: publicProcedure.query(() => db.getAllPositions()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getPositionById(input.id)),
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        requirements: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Aqui conectaríamos ao banco para salvar de verdade
        return { success: true };
      }),
  }),

  // Competencies - Tudo liberado
  competencies: router({
    list: publicProcedure.query(() => db.getAllCompetencies()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getCompetencyById(input.id)),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => db.getCompetenciesByCategory(input.category)),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.enum([
          "Cultural/Core",
          "Soft Skill (Atitude)",
          "Soft Skill (Relacional)",
          "Soft Skill (Distintiva)",
          "Hard Skill (Técnica)",
          "Results Skill",
          "Liderança"
        ]),
      }))
      .mutation(async ({ input }) => {
        return { success: true };
      }),
  }),

  // Employees - Lógica simplificada para mostrar todos
  employees: router({
    list: publicProcedure.query(async () => {
      // Removemos o 'if' que bloqueava o acesso
      return await db.getAllEmployees();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const employee = await db.getEmployeeById(input.id);
        return employee;
      }),
  }),
});

export type AppRouter = typeof appRouter;