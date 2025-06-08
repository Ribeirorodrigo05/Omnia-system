import { pgTable, uuid, varchar, timestamp, check } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { spaces } from "./spaces";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    type: varchar("type", { length: 20 }).notNull(),
  },
  (table) => ({
    typeCheck: check(
      "type_check",
      sql`${table.type} IN ('LIST', 'SPRINT', 'TEXT')`
    ),
  })
);

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
