import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { workspaces } from "./workspaces";
import { users } from "./users";

export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  joinedAt: timestamp("joined_at"),
  isActive: boolean("is_active").default(true).notNull(),
  permissions: jsonb("permissions"),
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers);
export const selectWorkspaceMemberSchema = createSelectSchema(workspaceMembers);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
