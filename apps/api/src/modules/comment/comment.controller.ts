import type { DbNewComment } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateComment, UpdateComment } from "./comment.schema";
import type CommentService from "./comment.service";

export default class CommentController {
    private commentService: CommentService;

    constructor(commentService: CommentService) {
        this.commentService = commentService;
    }

    private async validateTaskInProject(projectId: string, taskId: string) {
        const task = await this.commentService.getTaskById(taskId);

        if (!task || task.projectId !== projectId) {
            return null;
        }

        return task;
    }

    public async createComment(
        request: FastifyRequest<{
            Params: { projectId: string; taskId: string };
            Body: CreateComment;
        }>,
        reply: FastifyReply,
    ) {
        const task = await this.validateTaskInProject(
            request.params.projectId,
            request.params.taskId,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        const commentPayload: DbNewComment = {
            taskId: request.params.taskId,
            userId: request.jwtUser.id,
            content: request.body.content,
            parentCommentId: request.body.parentCommentId,
            attachments: request.body.attachments,
        };

        const comment = await this.commentService.createComment(commentPayload);

        return reply.code(201).send({ comment });
    }

    public async getTaskComments(
        request: FastifyRequest<{
            Params: { projectId: string; taskId: string };
        }>,
        reply: FastifyReply,
    ) {
        const task = await this.validateTaskInProject(
            request.params.projectId,
            request.params.taskId,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        const comments = await this.commentService.getTaskComments(
            request.params.taskId,
        );

        return reply.send({ comments });
    }

    public async getComment(
        request: FastifyRequest<{
            Params: { projectId: string; taskId: string; commentId: string };
        }>,
        reply: FastifyReply,
    ) {
        const task = await this.validateTaskInProject(
            request.params.projectId,
            request.params.taskId,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        const comment = await this.commentService.getCommentById(
            request.params.commentId,
        );

        if (!comment || comment.taskId !== request.params.taskId) {
            return reply.notFound("Comment not found");
        }

        return reply.send({ comment });
    }

    public async updateComment(
        request: FastifyRequest<{
            Params: { projectId: string; taskId: string; commentId: string };
            Body: UpdateComment;
        }>,
        reply: FastifyReply,
    ) {
        const task = await this.validateTaskInProject(
            request.params.projectId,
            request.params.taskId,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        const existingComment = await this.commentService.getCommentById(
            request.params.commentId,
        );

        if (
            !existingComment ||
            existingComment.taskId !== request.params.taskId
        ) {
            return reply.notFound("Comment not found");
        }

        const updatedComment = await this.commentService.updateComment(
            request.params.commentId,
            {
                content: request.body.content,
                attachments: request.body.attachments,
            },
        );

        return reply.send({ comment: updatedComment });
    }

    public async deleteComment(
        request: FastifyRequest<{
            Params: { projectId: string; taskId: string; commentId: string };
        }>,
        reply: FastifyReply,
    ) {
        const task = await this.validateTaskInProject(
            request.params.projectId,
            request.params.taskId,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        const existingComment = await this.commentService.getCommentById(
            request.params.commentId,
        );

        if (
            !existingComment ||
            existingComment.taskId !== request.params.taskId
        ) {
            return reply.notFound("Comment not found");
        }

        const deletedComment = await this.commentService.deleteComment(
            request.params.commentId,
        );

        return reply.send({ comment: deletedComment });
    }
}
