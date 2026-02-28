import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const meResponseSchema = z
    .object({
        user: z.object({
            id: z.string().uuid(),
            discordId: z.string(),
            fullName: z.string(),
            nickName: z.string(),
            avatar: z.string(),
            email: z.string().email(),
            lastAuth: z.date(),
            isVerified: z.boolean(),
            updatedAt: z.date(),
            createdAt: z.date(),
        }),
    })
    .meta({ $id: "meResponse" });

const meErrorResponseSchema = z
    .object({
        statusCode: z.literal(404),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "meErrorResponse" });

const discordServerListResponseSchema = z
    .array(
        z.object({
            id: z.string(),
            name: z.string(),
            icon: z.string(),
            banner: z.string(),
            owner: z.boolean(),
            permissions: z.string(),
        }),
    )
    .meta({ $id: "discordServerListResponse" });

const userProjectIdParamsSchema = z
    .object({
        projectId: z.string().uuid(),
    })
    .meta({ $id: "userProjectIdParams" });

const projectUsersWithRolesResponseSchema = z
    .object({
        users: z.array(
            z.object({
                id: z.string().uuid(),
                discordId: z.string(),
                fullName: z.string().nullable(),
                nickName: z.string().nullable(),
                avatar: z.string().nullable(),
                email: z.string().nullable(),
                roles: z.array(
                    z.object({
                        id: z.string().uuid(),
                        name: z.string(),
                        permissionCode: z.string(),
                    }),
                ),
            }),
        ),
    })
    .meta({ $id: "projectUsersWithRolesResponse" });

export type MeResponse = z.infer<typeof meResponseSchema>;
export type MeErrorResponse = z.infer<typeof meErrorResponseSchema>;
export type DiscordServerListResponse = z.infer<
    typeof discordServerListResponseSchema
>;
export type UserProjectIdParams = z.infer<typeof userProjectIdParamsSchema>;
export type ProjectUsersWithRolesResponse = z.infer<
    typeof projectUsersWithRolesResponseSchema
>;

export const zodUserSchemas = zodSchemasToJSONSchema([
    meResponseSchema,
    meErrorResponseSchema,
    discordServerListResponseSchema,
    userProjectIdParamsSchema,
    projectUsersWithRolesResponseSchema,
]);
