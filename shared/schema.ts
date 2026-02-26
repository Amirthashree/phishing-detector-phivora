import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const scanRequestSchema = z.object({
  url: z.string().optional(),
  text: z.string().optional()
}).refine(data => data.url || data.text, {
  message: "Either URL or text must be provided"
});

export const modelScoresSchema = z.object({
  xgboost: z.number(),
  random_forest: z.number(),
  sgd: z.number(),
  naive_bayes: z.number()
});

export const scanResponseSchema = z.object({
  scan_id: z.string(),
  label: z.number(),
  verdict: z.string(),
  confidence: z.number(),
  severity: z.string(),
  data_type: z.string(),
  model_scores: modelScoresSchema,
  timestamp: z.string(),
  input: z.object({
    url: z.string().optional(),
    text: z.string().optional()
  })
});

export const historyResponseSchema = z.object({
  total: z.number(),
  phishing: z.number(),
  legitimate: z.number(),
  scans: z.array(scanResponseSchema)
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;
export type ScanResponse = z.infer<typeof scanResponseSchema>;
export type HistoryResponse = z.infer<typeof historyResponseSchema>;
