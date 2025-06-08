import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { spaces } from "./spaces";
import { users } from "./users";

export const spaceMembers = pgTable("space_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceId: uuid("space_id")
    .notNull()
    .references(() => spaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  joinedAt: timestamp("joined_at"),
  isActive: boolean("is_active").default(true).notNull(),
  permissions: jsonb("permissions"),
});

export const insertSpaceMemberSchema = createInsertSchema(spaceMembers);
export const selectSpaceMemberSchema = createSelectSchema(spaceMembers);

export type SpaceMember = typeof spaceMembers.$inferSelect;
export type NewSpaceMember = typeof spaceMembers.$inferInsert;
