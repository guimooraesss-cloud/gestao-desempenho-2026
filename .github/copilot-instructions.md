# Instruções para Agentes de IA - Sistema de Gestão de Desempenho RH

## Arquitetura Geral

Sistema full-stack com **Node.js + Express + tRPC** (backend) e **React + Vite + TailwindCSS** (frontend). Dados em **MySQL via Drizzle ORM**. Deploy integrado com Manus.

- **Backend**: `server/` → tRPC routers em `server/routers.ts`
- **Frontend**: `client/src/` → SPA com páginas em `pages/`, componentes em `components/`
- **Compartilhado**: `shared/` → tipos TypeScript, erros, constantes
- **Database**: `drizzle/schema.ts` → schema MySQL + migrations automáticas

## Fluxo de Autenticação & Autorização

**3 níveis hierárquicos**: `master` (admin) → `leader` (gerente) → `employee` (colaborador)

```
// server/_core/trpc.ts define:
- publicProcedure: qualquer um acessa
- protectedProcedure: requer usuário autenticado
- masterProcedure: apenas master (admin)
```

**Login cookie-based**: Email armazenado em `user_session` cookie (httpOnly, 7 dias).
Quem é master: `MASTER_EMAIL` configurado em `server/routers.ts` (guimooraesss@gmail.com).

## Padrões tRPC

**Uso no Frontend**:
```tsx
import { api } from "@/lib/trpc";

const loginMutation = api.auth.login.useMutation();
const { data: user } = api.auth.me.useQuery();
```

**Criação no Backend**:
```ts
// server/routers.ts
export const appRouter = router({
  namespaced: router({
    operation: procedureType.input(schema).query/mutation(handler)
  })
});
```

## Estrutura de Componentes UI

Todos os componentes base em `client/src/components/ui/` (shadcn/ui + Radix):
- **Input/Forms**: `input.tsx`, `button.tsx`, `select.tsx`, `form.tsx` (react-hook-form)
- **Layouts**: `card.tsx`, `sidebar.tsx`, `sheet.tsx`
- **Charts**: `chart.tsx` (Recharts wrapper)
- **Dialogs**: `dialog.tsx`, `alert-dialog.tsx`

**DashboardLayout**: wrapper padrão com sidebar + navegação. Importar em pages novas.

## Temas & Styling

- **TailwindCSS v4** via `@tailwindcss/vite` (não inline em jsx)
- **Tema claro padrão** em `client/src/contexts/ThemeContext.tsx`
- **Cores**: CSS vars em `client/src/index.css` (azul corporativo)
- Dark mode: configurável via `<ThemeProvider switchable />`

## Workflows Essenciais

| Comando | Propósito |
|---------|-----------|
| `pnpm dev` | Dev server (hot reload) + backend watch |
| `pnpm build` | Vite + esbuild (backend → dist/index.js) |
| `pnpm start` | Produção (NODE_ENV=production) |
| `pnpm db:push` | Generate migrations + apply ao DB |
| `pnpm test` | Vitest (ex: auth.logout.test.ts) |
| `pnpm check` | TypeScript type check |

**Dev workflow**: `pnpm dev` → backend em `:3000`, frontend hot reload. Mude ports em `vite.config.ts` se necessário.

## Padrões de Dados

### Database Schema (drizzle/schema.ts)
- `users`: autenticação (openId, email, role)
- `employees`: dados RH (badge, sector, positionId, leaderId)
- `positions`: cargos com competências associadas
- `competencies`: 7 categorias fixas (Cultural, Soft Skills, Hard Skills, etc)
- `evaluations`: ciclos de avaliação (100-point weight distribution)
- `pdi`: Planos de Desenvolvimento Individual
- `nine_box`: matriz de retenção (9 quadrantes)

### Relacionamentos Hierárquicos
- `employee.leaderId` → `employee.id` (self-join, líder-liderado)
- Líderes **só veem seus liderados** (filtro no backend)

## Metodologia de Avaliação (Dinamizar)

- **100 créditos** distribuídos entre 6-7 competências
- **Notas**: 1-5 por competência
- **Cálculo**: (peso/100) × nota = pontuação ponderada
- **PDI gerado**: automático baseado em melhores/piores notas
- **Validação**: soma pesos = 100 (obrigatório)

Exemplo: Competência X (peso 20) com nota 4 = 0.20 × 4 = 0.80 pontos.

## Rotas Frontend

```
/ → Home (login)
/dashboard → Dashboard (métricas)
/positions → CRUD Cargos
/competencies → CRUD Competências (7 categorias fixas)
/employees → CRUD Colaboradores (hierarquia)
/evaluations → Avaliações (100-point distribution)
/nine-box → Matriz 9 quadrantes + PDI
/reports → Exportação PDF/CSV
```

## Tratamento de Erros

- **Backend**: `TRPCError` com códigos (`UNAUTHORIZED`, `FORBIDDEN`, `BAD_REQUEST`)
- **Frontend**: `react-query` retry automático, `sonner` toast notifications
- **Constantes**: `UNAUTHED_ERR_MSG`, `NOT_ADMIN_ERR_MSG` em `shared/const.ts`

## Setup do Projeto

1. `pnpm install` (node_modules + lock)
2. `.env` necessário: `DATABASE_URL`, `MANUS_*` vars (OAuth)
3. `pnpm db:push` → cria schema MySQL
4. `pnpm dev` → inicia

## Checklist para PRs de Novos Recursos

- [ ] Tipos TypeScript no schema ou `shared/types.ts`
- [ ] tRPC procedure em `server/routers.ts` (com procedure type correto)
- [ ] Query/Mutation no frontend via `api.*`
- [ ] UI em `client/src/pages/` ou `components/`
- [ ] Tests se lógica crítica (auth, cálculos)
- [ ] Migrations se tabelas mudaram (`pnpm db:push`)
- [ ] Filtros hierárquicos aplicados (master > leader > employee)
