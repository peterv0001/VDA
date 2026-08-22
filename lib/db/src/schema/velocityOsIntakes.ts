import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const velocityOsIntakesTable = pgTable("velocity_os_intakes", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  workEmail: text("work_email").notNull(),
  phone: text("phone"),
  titleRole: text("title_role").notNull(),
  companyName: text("company_name").notNull(),
  companyWebsite: text("company_website"),
  companyContext: text("company_context").notNull(),
  primaryChallenge: text("primary_challenge").notNull(),
  desiredOutcome: text("desired_outcome").notNull(),
  urgency: text("urgency").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVelocityOsIntakeSchema = createInsertSchema(
  velocityOsIntakesTable,
).omit({ id: true, createdAt: true });
export type InsertVelocityOsIntake = z.infer<
  typeof insertVelocityOsIntakeSchema
>;
export type VelocityOsIntake = typeof velocityOsIntakesTable.$inferSelect;