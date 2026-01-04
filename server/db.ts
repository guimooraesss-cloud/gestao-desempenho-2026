import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise"; // <--- Mudança 1: Importação mais segura
import { InsertUser, users, employees, positions, competencies } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Conexão com SSL ajustada para o Aiven
      const connection = await mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      } as any); 
      
      // <--- Mudança 2: "as any" aqui também para o Drizzle aceitar o Pool do Aiven
      _db = drizzle(connection as any);

    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email || "",
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value || "";
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'master';
      updateSet.role = 'master';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// --- CONSULTAS DE LEITURA (READ) ---

// Employee queries
export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeesByLeaderId(leaderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees).where(eq(employees.leaderId, leaderId));
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees);
}

// Position queries
export async function getPositionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(positions).where(eq(positions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPositions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(positions);
}

// Competency queries
export async function getCompetencyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(competencies).where(eq(competencies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCompetencies() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(competencies);
}

export async function getCompetenciesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(competencies).where(eq(competencies.category as any, category));
}

// --- FUNÇÕES DE ESCRITA (CREATE / UPDATE / DELETE) ---

export async function createEmployee(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Banco desconectado");
  // O "as any" garante que salve mesmo se o TS reclamar de campos opcionais
  await db.insert(employees).values(data as any);
}

export async function updateEmployee(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Banco desconectado");
  await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco desconectado");
  await db.delete(employees).where(eq(employees.id, id));
}