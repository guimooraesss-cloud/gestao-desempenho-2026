import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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
          (ctx.res as any).cookie("user_session", sessionData, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
          return { success: true };
        }

        const employees = await db.getAllEmployees();
        const employee = employees.find(e => 
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

  // --- DASHBOARD ---
  dashboard: router({
    getStats: publicProcedure.query(async () => {
      console.log("--- INICIANDO DASHBOARD ---");
      try {
        const employees = await db.getAllEmployees();
        console.log("Colaboradores encontrados (DB):", employees.length);

        let evaluations: any[] = [];
        try {
          if ((db as any).getAllEvaluations) {
            evaluations = await (db as any).getAllEvaluations();
          }
        } catch (e) {
          console.log("Erro ao buscar avaliações (ignorado):", e);
        }

        const totalEmployees = employees.length;
        const completed = evaluations.filter(e => e.status === "Concluído" || e.status === "completed").length;
        const inProgress = evaluations.filter(e => e.status === "Em Andamento" || e.status === "in_progress").length;
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

  // --- COLABORADORES (AGORA BLINDADO PARA SALVAR) ---
  employees: router({
    list: publicProcedure.query(async () => db.getAllEmployees()),
    
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => db.getEmployeeById(input.id)),
    
    create: publicProcedure
      .input(z.any()) 
      .mutation(async ({ input }) => {
        console.log("Tentando criar colaborador (RAW):", input);

        // Tratamento de segurança para não quebrar o banco
        const dataLimpa = {
            name: input.name || input.nome, 
            email: input.email,
            cpf: input.cpf,
            badge: input.badge || input.cracha,
            sector: input.sector || input.setor,
            
            // Converte string de data para objeto Date real ou null
            birthDate: input.birthDate ? new Date(input.birthDate) : null,
            admissionDate: input.admissionDate ? new Date(input.admissionDate) : null,

            // FORÇA NULL se vier texto nos campos de ID (evita o erro 400)
            positionId: typeof input.positionId === 'number' ? input.positionId : null,
            leaderId: typeof input.leaderId === 'number' ? input.leaderId : null,
            
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log("Dados limpos para salvar:", dataLimpa);
        await db.createEmployee(dataLimpa); 
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({ id: z.number(), data: z.any() }))
      .mutation(async ({ input }) => {
        // Remove campos perigosos na edição
        const { id, ...resto } = input.data;
        
        // Garante que datas sejam objetos Date
        if (resto.birthDate) resto.birthDate = new Date(resto.birthDate);
        if (resto.admissionDate) resto.admissionDate = new Date(resto.admissionDate);

        await db.updateEmployee(input.id, resto);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEmployee(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;