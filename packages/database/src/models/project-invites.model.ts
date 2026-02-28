import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import {
    index,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";
import { projectDefinedRolesModel } from "./project-defined-roles.model";
import { projectModel } from "./project.model";
import { usersModel } from "./user.model";

export const projectInvitesModel = pgTable(
    "project_invites",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        projectId: uuid("project_id")
            .notNull()
            .references(() => projectModel.id, { onDelete: "cascade" }),
        inviterId: uuid("inviter_id")
            .notNull()
            .references(() => usersModel.id, { onDelete: "cascade" }),
        roleId: uuid("role_id").references(() => projectDefinedRolesModel.id, {
            onDelete: "set null",
        }),
        tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
        inviteType: varchar("invite_type", { length: 32 })
            .notNull()
            .default("single_use"),
        restrictionType: varchar("restriction_type", { length: 32 })
            .notNull()
            .default("none"),
        restrictedEmail: varchar("restricted_email", { length: 255 }),
        restrictedDiscordId: varchar("restricted_discord_id", { length: 64 }),
        maxUses: integer("max_uses").notNull().default(1),
        usedCount: integer("used_count").notNull().default(0),
        expiresAt: timestamp("expires_at").notNull(),
        revokedAt: timestamp("revoked_at"),
        lastAcceptedAt: timestamp("last_accepted_at"),
        lastAcceptedBy: uuid("last_accepted_by").references(
            () => usersModel.id,
            {
                onDelete: "set null",
            },
        ),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        projectIdIdx: index("project_invites_project_id_idx").on(
            table.projectId,
        ),
        expiresAtIdx: index("project_invites_expires_at_idx").on(
            table.expiresAt,
        ),
    }),
);

export type DbProjectInvite = typeof projectInvitesModel.$inferSelect;
export type DbNewProjectInvite = typeof projectInvitesModel.$inferInsert;

export class ProjectInvitesDal {
    static async createInvite(
        input: DbNewProjectInvite,
    ): Promise<DbProjectInvite> {
        const [invite] = await db
            .insert(projectInvitesModel)
            .values(input)
            .returning();
        return invite;
    }

    static async getInviteByTokenHash(
        tokenHash: string,
    ): Promise<DbProjectInvite | null> {
        const result = await db
            .select()
            .from(projectInvitesModel)
            .where(eq(projectInvitesModel.tokenHash, tokenHash))
            .limit(1);

        return result.at(0) ?? null;
    }

    static async getInviteById(id: string): Promise<DbProjectInvite | null> {
        const result = await db
            .select()
            .from(projectInvitesModel)
            .where(eq(projectInvitesModel.id, id))
            .limit(1);

        return result.at(0) ?? null;
    }

    static async listInvitesByProject(
        projectId: string,
    ): Promise<DbProjectInvite[]> {
        return await db
            .select()
            .from(projectInvitesModel)
            .where(eq(projectInvitesModel.projectId, projectId));
    }

    static async revokeInvite(id: string): Promise<DbProjectInvite | null> {
        const [invite] = await db
            .update(projectInvitesModel)
            .set({
                revokedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(projectInvitesModel.id, id),
                    isNull(projectInvitesModel.revokedAt),
                ),
            )
            .returning();

        return invite ?? null;
    }

    static async consumeInvite(
        tokenHash: string,
        userId: string,
    ): Promise<DbProjectInvite | null> {
        const now = new Date();

        const [invite] = await db
            .update(projectInvitesModel)
            .set({
                usedCount: sql<number>`${projectInvitesModel.usedCount} + 1`,
                lastAcceptedAt: now,
                lastAcceptedBy: userId,
                updatedAt: now,
            })
            .where(
                and(
                    eq(projectInvitesModel.tokenHash, tokenHash),
                    isNull(projectInvitesModel.revokedAt),
                    gt(projectInvitesModel.expiresAt, now),
                    lt(
                        projectInvitesModel.usedCount,
                        projectInvitesModel.maxUses,
                    ),
                ),
            )
            .returning();

        return invite ?? null;
    }
}
