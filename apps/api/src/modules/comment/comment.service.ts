import { CommentDal, TaskDal, type DbNewComment } from "@taskcord/database";

export default class CommentService {
    public async createComment(commentData: DbNewComment) {
        return CommentDal.createComment(commentData);
    }

    public async getTaskComments(taskId: string) {
        return CommentDal.getTaskComments(taskId);
    }

    public async getCommentById(commentId: string) {
        return CommentDal.getCommentById(commentId);
    }

    public async updateComment(commentId: string, data: Partial<DbNewComment>) {
        return CommentDal.updateComment(commentId, data);
    }

    public async deleteComment(commentId: string) {
        return CommentDal.deleteComment(commentId);
    }

    public async getTaskById(taskId: string) {
        return TaskDal.getTaskById(taskId);
    }
}
