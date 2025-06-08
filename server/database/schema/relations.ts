import { relations } from "drizzle-orm";
import {
  users,
  workspaces,
  workspaceMembers,
  spaces,
  spaceMembers,
  categories,
} from "./index";

export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceMemberships: many(workspaceMembers),
  createdSpaces: many(spaces),
  spaceMemberships: many(spaceMembers),
  ownedCategories: many(categories),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  spaces: many(spaces),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  })
);

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [spaces.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [spaces.createdBy],
    references: [users.id],
  }),
  members: many(spaceMembers),
  categories: many(categories),
}));

export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceMembers.spaceId],
    references: [spaces.id],
  }),
  user: one(users, {
    fields: [spaceMembers.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
  space: one(spaces, {
    fields: [categories.spaceId],
    references: [spaces.id],
  }),
  owner: one(users, {
    fields: [categories.ownerId],
    references: [users.id],
  }),
}));
