import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role hierarchy: master (admin), leader, employee
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // For email/password auth
  role: mysqlEnum("role", ["master", "leader", "employee"]).default("employee").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employees table - stores employee data linked to users
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badge: varchar("badge", { length: 50 }).notNull().unique(),
  sector: varchar("sector", { length: 100 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  positionId: int("positionId").notNull(),
  birthDate: date("birthDate"),
  admissionDate: date("admissionDate").notNull(),
  leaderId: int("leaderId"), // FK to another employee (leader)
  lastAccessAt: timestamp("lastAccessAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Positions (Cargos) table
 */
export const positions = mysqlTable("positions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  requirements: text("requirements"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Position = typeof positions.$inferSelect;
export type InsertPosition = typeof positions.$inferInsert;

/**
 * Competencies table
 * Categories: Cultural/Core, Soft Skill (Atitude), Soft Skill (Relacional), Soft Skill (Distintiva), Hard Skill (Técnica), Results Skill, Liderança
 */
export const competencies = mysqlTable("competencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "Cultural/Core",
    "Soft Skill (Atitude)",
    "Soft Skill (Relacional)",
    "Soft Skill (Distintiva)",
    "Hard Skill (Técnica)",
    "Results Skill",
    "Liderança"
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Competency = typeof competencies.$inferSelect;
export type InsertCompetency = typeof competencies.$inferInsert;

/**
 * Position-Competency relationship (many-to-many)
 */
export const positionCompetencies = mysqlTable("positionCompetencies", {
  id: int("id").autoincrement().primaryKey(),
  positionId: int("positionId").notNull(),
  competencyId: int("competencyId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PositionCompetency = typeof positionCompetencies.$inferSelect;
export type InsertPositionCompetency = typeof positionCompetencies.$inferInsert;

/**
 * Evaluation Cycles
 */
export const evaluationCycles = mysqlTable("evaluationCycles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  status: mysqlEnum("status", ["planning", "in_progress", "completed"]).default("planning").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationCycle = typeof evaluationCycles.$inferSelect;
export type InsertEvaluationCycle = typeof evaluationCycles.$inferInsert;

/**
 * Evaluations - stores evaluation data with Dinamizar methodology
 * Each evaluation distributes 100 credits among competencies
 */
export const evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  cycleId: int("cycleId").notNull(),
  evaluatedEmployeeId: int("evaluatedEmployeeId").notNull(), // Employee being evaluated
  evaluatorId: int("evaluatorId").notNull(), // Leader doing the evaluation
  status: mysqlEnum("status", ["draft", "submitted", "completed"]).default("draft").notNull(),
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }), // Final weighted score
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Evaluation Scores - stores individual competency scores for Dinamizar methodology
 * Weight (0-100) represents the credit allocation
 * Score (1-5) is the grade given by the evaluator
 * Weighted Score = (Weight / 100) * Score
 */
export const evaluationScores = mysqlTable("evaluationScores", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  competencyId: int("competencyId").notNull(),
  weight: int("weight").notNull(), // 0-100 (credit allocation)
  score: int("score").notNull(), // 1-5 (grade)
  weightedScore: decimal("weightedScore", { precision: 5, scale: 2 }), // (weight/100) * score
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationScore = typeof evaluationScores.$inferSelect;
export type InsertEvaluationScore = typeof evaluationScores.$inferInsert;

/**
 * PDI (Plano de Desenvolvimento Individual)
 */
export const pdis = mysqlTable("pdis", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  employeeId: int("employeeId").notNull(),
  strengths: text("strengths"), // Best competencies
  improvementAreas: text("improvementAreas"), // Worst competencies
  developmentPlan: text("developmentPlan"), // Actions and goals
  feedback: text("feedback"), // Formalized feedback
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PDI = typeof pdis.$inferSelect;
export type InsertPDI = typeof pdis.$inferInsert;

/**
 * Nine Box - stores nine box classification
 * Performance: 1 (low), 2 (medium), 3 (high)
 * Potential: 1 (low), 2 (medium), 3 (high)
 */
export const nineBoxes = mysqlTable("nineBoxes", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  employeeId: int("employeeId").notNull(),
  performance: int("performance").notNull(), // 1-3
  potential: int("potential").notNull(), // 1-3
  classification: varchar("classification", { length: 50 }).notNull(), // e.g., "High Performer", "Future Leader"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NineBox = typeof nineBoxes.$inferSelect;
export type InsertNineBox = typeof nineBoxes.$inferInsert;

/**
 * Relations for type safety
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  employee: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
  evaluationsAsEvaluator: many(evaluations, {
    relationName: "evaluator",
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
  }),
  leader: one(employees, {
    fields: [employees.leaderId],
    references: [employees.id],
    relationName: "leader",
  }),
  subordinates: many(employees, {
    relationName: "leader",
  }),
  evaluationsAsEvaluated: many(evaluations, {
    relationName: "evaluated",
  }),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  competencies: many(positionCompetencies),
}));

export const competenciesRelations = relations(competencies, ({ many }) => ({
  positions: many(positionCompetencies),
}));

export const evaluationsRelations = relations(evaluations, ({ one, many }) => ({
  cycle: one(evaluationCycles, {
    fields: [evaluations.cycleId],
    references: [evaluationCycles.id],
  }),
  evaluatedEmployee: one(employees, {
    fields: [evaluations.evaluatedEmployeeId],
    references: [employees.id],
    relationName: "evaluated",
  }),
  evaluator: one(employees, {
    fields: [evaluations.evaluatorId],
    references: [employees.id],
    relationName: "evaluator",
  }),
  scores: many(evaluationScores),
  pdi: one(pdis),
  nineBox: one(nineBoxes),
}));