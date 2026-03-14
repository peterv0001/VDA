import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioAccessRequestsTable = pgTable("portfolio_access_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  organization: text("organization").notNull(),
  email: text("email").notNull(),
  titleRole: text("title_role"),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortfolioAccessRequestSchema = createInsertSchema(portfolioAccessRequestsTable).omit({ id: true, createdAt: true });
export type InsertPortfolioAccessRequest = z.infer<typeof insertPortfolioAccessRequestSchema>;
export type PortfolioAccessRequest = typeof portfolioAccessRequestsTable.$inferSelect;
