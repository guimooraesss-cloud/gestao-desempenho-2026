import { COOKIE_NAME } from "@shared/const";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

// --- CONFIGURAÇÃO ---
const MASTER_EMAIL = "guimooraesss@gmail.com"; // Seu email de mestre

export const appRouter = router({
  // Sistema de Autenticação Simplificado
  auth: router({
    // 1. Quem sou eu? (Lê o cookie para saber quem está logado)
    me: publicProcedure.query(async ({ ctx }) => {
      const userCookie = ctx.req.cookies["user_session"];
      
      // Se não tiver cookie, não está logado
      if (!userCookie) return null;

      const userData = JSON.parse(userCookie);

      // Se for o Mestre (Você)
      if (userData.email === MASTER_EMAIL) {
        return { id: 1, username: "Gui Master", role: "master", avatarUrl: null };
      }

      // Se for funcionário, busca no banco para garantir que ainda existe
      // (Aqui assumimos que o cookie guarda o ID do funcionário)
      if (userData.role === "employee") {
         // Tenta buscar o funcionário no banco
         const employees = await db.getAllEmployees(); // Busca simplificada
         const employee = employees.find(e => e.id === userData.id);
         if (employee) {
             return { id: employee.id, username: employee.name, role: "employee", avatarUrl: null };
         }
      }

      return null;
    }),

    // 2. Fazer Login (Recebe o email e cria o cookie)
    login: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const email = input.email.toLowerCase().trim();

        // A) É o Mestre?
        if (email === MASTER_EMAIL) {
          const sessionData = JSON.stringify({ email: email, role: "master", id: 1 });
          ctx.res.cookie("user_session", sessionData, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 dias
          return { success: true };
        }

        // B) É um funcionário?
        const employees = await db.getAllEmployees();
        // Nota: Assumindo que seus employees tenham campo 'email' ou similar. 
        // Se não tiverem, a gente busca pelo nome ou cria um campo depois.
        // Por enquanto, vamos simular que se o nome for igual ao email (antes do @) entra.
        // O ideal é adicionar email na tabela employees depois.
        
        // Lógica Provisória: Verifica se existe algum funcionário com esse nome/email
        const employee = employees.find(e => 
            e.name.toLowerCase().includes(email.split('@')[0]) || 
            (e as any).email === email
        );

        if (employee) {
            const sessionData = JSON.stringify({ email: email, role: "employee", id: employee.id });
            ctx.res.cookie("user_session", sessionData, { httpOnly: true });
            return { success: true };
        }

        throw new Error("Usuário não encontrado!");
      }),

    // 3. Sair
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("user_session");
      return { success: true };
    }),
  }),

  // --- RESTO DO SISTEMA (Mantém igual) ---
  system: router({
     // Mantenha as rotas de sistema se existirem, ou deixe vazio se não usar
  }),

  positions: router({
    list: publicProcedure.query(() => db.getAllPositions()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getPositionById(input.id)),
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        requirements: z.string().optional(),
      }))
      .mutation(async ({ input }) => { return { success: true }; }),
  }),

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
        category: z.enum(["Cultural/Core", "Soft Skill (Atitude)", "Soft Skill (Relacional)", "Soft Skill (Distintiva)", "Hard Skill (Técnica)", "Results Skill", "Liderança"]),
      }))
      .mutation(async ({ input }) => { return { success: true }; }),
  }),

  employees: router({
    list: publicProcedure.query(async () => db.getAllEmployees()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => db.getEmployeeById(input.id)),
  }),
});

export type AppRouter = typeof appRouter;