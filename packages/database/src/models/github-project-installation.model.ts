import { and, eq } from "drizzle-orm";
import {
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";
import { githubInstallationsModel } from "./github-installation.model";
import { projectModel } from "./project.model";
import { usersModel } from "./user.model";

export const githubProjectInstallationsModel = pgTable(
    "github_project_installations",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        projectId: uuid("project_id")
            .notNull()
            .references(() => projectModel.id, { onDelete: "cascade" }),
        installationId: uuid("installation_id")
            .notNull()
            .references(() => githubInstallationsModel.id, {
                onDelete: "cascade",
            }),
        linkedByUserId: uuid("linked_by_user_id").references(
            () => usersModel.id,
            { onDelete: "set null" },
        ),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        projectInstallationUnique: uniqueIndex(
            "github_project_installations_project_installation_unique",
        ).on(table.projectId, table.installationId),
        projectIdIdx: index("github_project_installations_project_id_idx").on(
            table.projectId,
        ),
    }),
);

export type DbGithubProjectInstallation =
    typeof githubProjectInstallationsModel.$inferSelect;
export type DbNewGithubProjectInstallation =
    typeof githubProjectInstallationsModel.$inferInsert;

export class GithubProjectInstallationsDal {
    static async upsertProjectInstallation(
        input: DbNewGithubProjectInstallation,
    ): Promise<DbGithubProjectInstallation> {
        const [record] = await db
            .insert(githubProjectInstallationsModel)
            .values(input)
            .onConflictDoUpdate({
                target: [
                    githubProjectInstallationsModel.projectId,
                    githubProjectInstallationsModel.installationId,
                ],
                set: {
                    linkedByUserId: input.linkedByUserId,
                    updatedAt: new Date(),
                },
            })
            .returning();

        return record;
    }

    static async getByProjectAndInstallation(
        projectId: string,
        installationId: string,
    ): Promise<DbGithubProjectInstallation | null> {
        const result = await db
            .select()
            .from(githubProjectInstallationsModel)
            .where(
                and(
                    eq(githubProjectInstallationsModel.projectId, projectId),
                    eq(
                        githubProjectInstallationsModel.installationId,
                        installationId,
                    ),
                ),
            )
            .limit(1);

        return result.at(0) ?? null;
    }
}
