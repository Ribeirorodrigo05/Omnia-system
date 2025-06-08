import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { workspaces } from "./workspaces";
import { users } from "./users";

export const spaces = pgTable("spaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  settings: jsonb("settings"),
});

export const insertSpaceSchema = createInsertSchema(spaces);
export const selectSpaceSchema = createSelectSchema(spaces);

export type Space = typeof spaces.$inferSelect;
export type NewSpace = typeof spaces.$inferInsert;
