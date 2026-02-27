import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { usersModel } from "./user.model"; // Import the usersModel

export const projectModel = pgTable("projects", {
    id: uuid("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => uuidv7()),
    title: varchar("title").notNull(),
    description: text("description").default(""),
    creatorId: uuid("creator_id")
        .notNull()
        .references(() => usersModel.id), // Wrap in a function
    managerId: varchar("manager_id").notNull(), // discord id
    discordServerId: varchar("discord_server_id").notNull(),
    projectType: varchar("project_type").notNull().default("general"),
    status: varchar("status").default(""),
    createdAt: timestamp("created_at").defaultNow(),
    logo: varchar("logo").default(""),
    startingTimestamp: timestamp("starting_timestamp"),
    estimatedCompletionTimestamp: timestamp("estimated_completion_timestamp"),
    completedAt: timestamp("completed_at"),
});

export type DbProject = typeof projectModel.$inferSelect;
export type DbNewProject = typeof projectModel.$inferInsert;
