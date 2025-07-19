import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  brand: text("brand"),
  description: text("description"),
  weight: text("weight"),
  dimensions: text("dimensions"),
  materials: text("materials"),
  manufacturingCountry: text("manufacturing_country"),
  manufacturingDate: text("manufacturing_date"),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  status: text("status").default("draft"), // draft, in_progress, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  questionText: text("question_text").notNull(),
  answer: text("answer"),
  category: text("category").notNull(), // sustainability, quality, transparency
  importance: text("importance").notNull(), // high, medium, low
  aiGenerated: boolean("ai_generated").default(true),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }).notNull(),
  sustainabilityScore: decimal("sustainability_score", { precision: 5, scale: 2 }).notNull(),
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }).notNull(),
  transparencyScore: decimal("transparency_score", { precision: 5, scale: 2 }).notNull(),
  insights: jsonb("insights").$type<string[]>().default([]),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  pdfUrl: text("pdf_url"),
  status: text("status").default("generating"), // generating, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, { fields: [products.userId], references: [users.id] }),
  questions: many(questions),
  reports: many(reports),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  product: one(products, { fields: [questions.productId], references: [products.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  product: one(products, { fields: [reports.productId], references: [products.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
