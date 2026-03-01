import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectTaskComment = {
    id: z.string().uuid(),
    taskId: z.string().uuid(),
    userId: z.string().uuid(),
    parentCommentId: z.string().uuid().nullable(),
    content: z.string(),
    attachments: z.unknown().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
};

const createCommentSchema = z
    .object({
        content: z.string().min(1),
        parentCommentId: z.string().uuid().optional(),
        attachments: z.unknown().optional(),
    })
    .meta({ $id: "createCommentSchema" });

const updateCommentSchema = z
    .object({
        content: z.string().min(1).optional(),
        attachments: z.unknown().nullable().optional(),
    })
    .meta({ $id: "updateCommentSchema" });

const commentResponseSchema = z
    .object({
        comment: z.object(ProjectTaskComment),
    })
    .meta({ $id: "commentResponse" });

const commentsResponseSchema = z
    .object({
        comments: z.array(z.object(ProjectTaskComment)),
    })
    .meta({ $id: "commentsResponse" });

const commentErrorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "commentErrorResponse" });

const commentRouteParamsSchema = z
    .object({
        projectId: z.string().uuid(),
        taskId: z.string().uuid(),
        commentId: z.string().uuid(),
    })
    .meta({ $id: "commentRouteParams" });

const commentTaskRouteParamsSchema = z
    .object({
        projectId: z.string().uuid(),
        taskId: z.string().uuid(),
    })
    .meta({ $id: "commentTaskRouteParams" });

export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;

export const zodCommentSchemas = zodSchemasToJSONSchema([
    createCommentSchema,
    updateCommentSchema,
    commentResponseSchema,
    commentsResponseSchema,
    commentErrorResponseSchema,
    commentRouteParamsSchema,
    commentTaskRouteParamsSchema,
]);
