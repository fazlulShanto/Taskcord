import { TaskDal, type DbNewTask, type DbTask } from "@taskcord/database";

export default class TaskService {
    public async createTask(taskData: DbNewTask): Promise<DbTask> {
        return TaskDal.createTask(taskData);
    }

    public async getTaskById(id: string): Promise<DbTask | null> {
        return TaskDal.getTaskById(id);
    }

    public async getTasksByProjectId(projectId: string): Promise<DbTask[]> {
        return TaskDal.getTasksByProjectId(projectId);
    }

    public async updateTask(
        id: string,
        taskData: Partial<DbNewTask>,
    ): Promise<DbTask | null> {
        return TaskDal.updateTask(id, taskData);
    }

    public async deleteTask(id: string): Promise<DbTask | null> {
        return TaskDal.deleteTask(id);
    }
}
