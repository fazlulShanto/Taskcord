import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { usersModel } from "./user.model";
import { projectModel } from "./project.model";
import { projectDefinedRolesModel } from "./project-defined-roles.model";
import { uuidv7 } from "uuidv7";

export const projectUserRoles = pgTable(
  "project_user_roles",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv7()),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersModel.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => projectDefinedRolesModel.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectModel.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow(),
  },
  (table) => [unique().on(table.userId, table.roleId, table.projectId)],
);
