import { and, eq } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";
import { githubInstallationsModel } from "./github-installation.model";
import { projectModel } from "./project.model";

export const githubProjectRepositoriesModel = pgTable(
    "github_project_repositories",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        projectId: uuid("project_id")
            .notNull()
            .references(() => projectModel.id, { onDelete: "cascade" }),
        installationId: uuid("installation_id").references(
            () => githubInstallationsModel.id,
            { onDelete: "set null" },
        ),
        repositoryId: varchar("repository_id", { length: 64 }).notNull(),
        owner: varchar("owner", { length: 255 }).notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        fullName: varchar("full_name", { length: 512 }).notNull(),
        defaultBranch: varchar("default_branch", { length: 255 })
            .notNull()
            .default("main"),
        isPrivate: boolean("is_private").notNull().default(false),
        isActive: boolean("is_active").notNull().default(true),
        lastSyncedAt: timestamp("last_synced_at"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        projectRepoUnique: uniqueIndex(
            "github_project_repositories_project_repo_unique",
        ).on(table.projectId, table.repositoryId),
        projectIdIdx: index("github_project_repositories_project_id_idx").on(
            table.projectId,
        ),
        installationIdIdx: index(
            "github_project_repositories_installation_id_idx",
        ).on(table.installationId),
    }),
);

export type DbGithubProjectRepository =
    typeof githubProjectRepositoriesModel.$inferSelect;
export type DbNewGithubProjectRepository =
    typeof githubProjectRepositoriesModel.$inferInsert;

export class GithubProjectRepositoriesDal {
    static async upsertProjectRepository(
        input: DbNewGithubProjectRepository,
    ): Promise<DbGithubProjectRepository> {
        const [record] = await db
            .insert(githubProjectRepositoriesModel)
            .values(input)
            .onConflictDoUpdate({
                target: [
                    githubProjectRepositoriesModel.projectId,
                    githubProjectRepositoriesModel.repositoryId,
                ],
                set: {
                    installationId: input.installationId,
                    owner: input.owner,
                    name: input.name,
                    fullName: input.fullName,
                    defaultBranch: input.defaultBranch,
                    isPrivate: input.isPrivate,
                    isActive: true,
                    updatedAt: new Date(),
                },
            })
            .returning();

        return record;
    }

    static async getProjectRepositories(
        projectId: string,
    ): Promise<DbGithubProjectRepository[]> {
        return await db
            .select()
            .from(githubProjectRepositoriesModel)
            .where(eq(githubProjectRepositoriesModel.projectId, projectId));
    }

    static async deactivateProjectRepository(
        projectId: string,
        repositoryId: string,
    ): Promise<DbGithubProjectRepository | null> {
        const [record] = await db
            .update(githubProjectRepositoriesModel)
            .set({
                isActive: false,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(githubProjectRepositoriesModel.projectId, projectId),
                    eq(
                        githubProjectRepositoriesModel.repositoryId,
                        repositoryId,
                    ),
                ),
            )
            .returning();

        return record ?? null;
    }
}
