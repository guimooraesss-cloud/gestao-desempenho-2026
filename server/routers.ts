import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
// Removido import do cookie-parser pois não é usado aqui diretamente

// --- CONFIGURAÇÃO ---
const MASTER_EMAIL = "guimooraesss@gmail.com"; 

export const appRouter = router({
  // --- AUTENTICAÇÃO ---
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      const userCookie = ctx.req.cookies["user_session"];
      if (!userCookie) return null;
      
      try {
        const userData = JSON.parse(userCookie);

        if (userData.email === MASTER_EMAIL) {
          return { id: 1, username: "Gui Master", role: "master", avatarUrl: null };
        }

        // Verifica se é funcionário
        if (userData.role === "employee") {
           const employees = await db.getAllEmployees();
           const employee = employees.find(e => e.id === userData.id);
           
           if (employee) {
               // Usamos (employee as any).name para garantir que o TS não reclame se o tipo estiver desatualizado
               return { 
                 id: employee.id, 
                 username: (employee as any).name || "Colaborador", 
                 role: "employee", 
                 avatarUrl: null 
               };
           }
        }
      } catch (e) {
        return null;
      }
      return null;
    }),

    login: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const email = input.email.toLowerCase().trim();

        if (email === MASTER_EMAIL) {
          const sessionData = JSON.stringify({ email: email, role: "master", id: 1 });
          // Forçamos (ctx.res as any) para garantir acesso à função cookie
          (ctx.res as any).cookie("user_session", sessionData, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
          return { success: true };
        }

        const employees = await db.getAllEmployees();
        const employee = employees.find(e => 
            // Usamos (e as any) para acessar name e email sem erro de tipo
            ((e as any).name || "").toLowerCase().includes(email.split('@')[0]) || 
            (e as any).email === email
        );

        if (employee) {
            const sessionData = JSON.stringify({ email: email, role: "employee", id: employee.id });
            (ctx.res as any).cookie("user_session", sessionData, { httpOnly: true });
            return { success: true };
        }

        throw new Error("Usuário não encontrado!");
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      (ctx.res as any).clearCookie("user_session");
      return { success: true };
    }),
  }),

  // --- DASHBOARD (COM LOGS DE DEBUG) ---
  dashboard: router({
    getStats: publicProcedure.query(async () => {
      console.log("--- INICIANDO DASHBOARD ---");
      
      try {
        // 1. Busca dados reais
        const employees = await db.getAllEmployees();
        console.log("Colaboradores encontrados (DB):", employees.length);

        // Tenta buscar avaliações
        let evaluations: any[] = [];
        try {
          // Verifica se a função existe antes de chamar
          if ((db as any).getAllEvaluations) {
            evaluations = await (db as any).getAllEvaluations();
          } else {
            console.log("Função getAllEvaluations não existe no db.ts, retornando vazio.");
          }
        } catch (e) {
          console.log("Erro ao buscar avaliações (ignorado):", e);
        }

        // 2. Calcula Totais
        const totalEmployees = employees.length;
        const completed = evaluations.filter(e => e.status === "Concluído" || e.status === "completed").length;
        const inProgress = evaluations.filter(e => e.status === "Em Andamento" || e.status === "in_progress").length;
        
        // Pendentes = Total - (Concluídos + Em Andamento)
        const pending = Math.max(0, totalEmployees - (completed + inProgress)); 
        
        console.log("Retornando stats:", { totalEmployees, completed, pending });

        const recentActivity = evaluations
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 5)
          .map(ev => ({
              id: ev.id,
              employeeName: ev.employeeName || "Colaborador",
              status: ev.status,
              date: ev.date || "Hoje"
          }));

        return {
          totalEmployees,
          completed,
          inProgress,
          pending,
          recentActivity
        };
      } catch (error) {
        console.error("ERRO CRÍTICO NO DASHBOARD:", error);
        return { totalEmployees: 0, completed: 0, inProgress: 0, pending: 0, recentActivity: [] };
      }
    })
  }),

  // --- POSIÇÕES / CARGOS ---
  positions: router({
    list: publicProcedure.query(() => db.getAllPositions()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getPositionById(input.id)),
    create: publicProcedure
      .input(z.object({ title: z.string().min(1), description: z.string().optional(), requirements: z.string().optional() }))
      .mutation(async ({ input }) => { return { success: true }; }),
  }),

  // --- COMPETÊNCIAS ---
  competencies: router({
    list: publicProcedure.query(() => db.getAllCompetencies()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getCompetencyById(input.id)),
    getByCategory: publicProcedure.input(z.object({ category: z.string() })).query(({ input }) => db.getCompetenciesByCategory(input.category)),
    create: publicProcedure
      .input(z.object({ name: z.string().min(1), description: z.string().optional(), category: z.enum(["Cultural/Core", "Soft Skill (Atitude)", "Soft Skill (Relacional)", "Soft Skill (Distintiva)", "Hard Skill (Técnica)", "Results Skill", "Liderança"]) }))
      .mutation(async ({ input }) => { return { success: true }; }),
  }),

  // --- COLABORADORES ---
  employees: router({
    list: publicProcedure.query(async () => db.getAllEmployees()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => db.getEmployeeById(input.id)),
  }),
});

export type AppRouter = typeof appRouter;