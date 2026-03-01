import type { FastifyInstance } from "fastify";
import CommentController from "./comment.controller";
import type { CreateComment, UpdateComment } from "./comment.schema";
import CommentService from "./comment.service";

export default function CommentRoute(fastify: FastifyInstance) {
    const commentController = new CommentController(new CommentService());

    fastify.post<{
        Params: { projectId: string; taskId: string };
        Body: CreateComment;
    }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Comments"],
                description: "Create a task comment",
                params: { $ref: "commentTaskRouteParams" },
                body: { $ref: "createCommentSchema" },
                response: {
                    201: { $ref: "commentResponse" },
                    400: { $ref: "commentErrorResponse" },
                },
            },
        },
        commentController.createComment.bind(commentController),
    );

    fastify.get<{
        Params: { projectId: string; taskId: string };
    }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Comments"],
                description: "Get all comments for a task",
                params: { $ref: "commentTaskRouteParams" },
                response: {
                    200: { $ref: "commentsResponse" },
                },
            },
        },
        commentController.getTaskComments.bind(commentController),
    );

    fastify.get<{
        Params: { projectId: string; taskId: string; commentId: string };
    }>(
        "/:commentId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Comments"],
                description: "Get a task comment by id",
                params: { $ref: "commentRouteParams" },
                response: {
                    200: { $ref: "commentResponse" },
                    404: { $ref: "commentErrorResponse" },
                },
            },
        },
        commentController.getComment.bind(commentController),
    );

    fastify.put<{
        Params: { projectId: string; taskId: string; commentId: string };
        Body: UpdateComment;
    }>(
        "/:commentId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Comments"],
                description: "Update a task comment",
                params: { $ref: "commentRouteParams" },
                body: { $ref: "updateCommentSchema" },
                response: {
                    200: { $ref: "commentResponse" },
                    404: { $ref: "commentErrorResponse" },
                },
            },
        },
        commentController.updateComment.bind(commentController),
    );

    fastify.delete<{
        Params: { projectId: string; taskId: string; commentId: string };
    }>(
        "/:commentId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Comments"],
                description: "Delete a task comment",
                params: { $ref: "commentRouteParams" },
                response: {
                    200: { $ref: "commentResponse" },
                    404: { $ref: "commentErrorResponse" },
                },
            },
        },
        commentController.deleteComment.bind(commentController),
    );
}
