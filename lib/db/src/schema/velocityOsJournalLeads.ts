import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const velocityOsJournalLeadsTable = pgTable(
  "velocity_os_journal_leads",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    documentId: text("document_id").notNull(),
    documentVersion: text("document_version").notNull(),
    downloadTokenHash: text("download_token_hash").notNull(),
    downloadTokenExpiresAt: timestamp("download_token_expires_at", {
      withTimezone: true,
    }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("velocity_os_journal_leads_email_document_idx").on(
      table.email,
      table.documentId,
      table.documentVersion,
    ),
    uniqueIndex("velocity_os_journal_leads_token_idx").on(
      table.downloadTokenHash,
    ),
  ],
);

export const insertVelocityOsJournalLeadSchema = createInsertSchema(
  velocityOsJournalLeadsTable,
).omit({ id: true, createdAt: true });

export type InsertVelocityOsJournalLead = z.infer<
  typeof insertVelocityOsJournalLeadSchema
>;
export type VelocityOsJournalLead =
  typeof velocityOsJournalLeadsTable.$inferSelect;