import { eq } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";
import { usersModel } from "./user.model";

export const githubInstallationsModel = pgTable(
    "github_installations",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        githubInstallationId: varchar("github_installation_id", {
            length: 64,
        })
            .notNull()
            .unique(),
        appSlug: varchar("app_slug", { length: 255 }),
        accountId: varchar("account_id", { length: 64 }),
        accountLogin: varchar("account_login", { length: 255 }),
        accountType: varchar("account_type", { length: 64 }),
        targetType: varchar("target_type", { length: 64 }),
        createdByUserId: uuid("created_by_user_id").references(
            () => usersModel.id,
            { onDelete: "set null" },
        ),
        isActive: boolean("is_active").notNull().default(true),
        lastSyncedAt: timestamp("last_synced_at"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        githubInstallationIdIdx: index(
            "github_installations_installation_id_idx",
        ).on(table.githubInstallationId),
        createdByUserIdIdx: index(
            "github_installations_created_by_user_idx",
        ).on(table.createdByUserId),
    }),
);

export type DbGithubInstallation = typeof githubInstallationsModel.$inferSelect;
export type DbNewGithubInstallation =
    typeof githubInstallationsModel.$inferInsert;

export class GithubInstallationsDal {
    static async upsertInstallation(
        input: DbNewGithubInstallation,
    ): Promise<DbGithubInstallation> {
        const [installation] = await db
            .insert(githubInstallationsModel)
            .values(input)
            .onConflictDoUpdate({
                target: githubInstallationsModel.githubInstallationId,
                set: {
                    appSlug: input.appSlug,
                    accountId: input.accountId,
                    accountLogin: input.accountLogin,
                    accountType: input.accountType,
                    targetType: input.targetType,
                    createdByUserId: input.createdByUserId,
                    isActive: true,
                    updatedAt: new Date(),
                },
            })
            .returning();

        return installation;
    }

    static async getByGithubInstallationId(
        githubInstallationId: string,
    ): Promise<DbGithubInstallation | null> {
        const result = await db
            .select()
            .from(githubInstallationsModel)
            .where(
                eq(
                    githubInstallationsModel.githubInstallationId,
                    githubInstallationId,
                ),
            )
            .limit(1);

        return result.at(0) ?? null;
    }
}
