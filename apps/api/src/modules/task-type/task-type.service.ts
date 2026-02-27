import {
    TaskTypeDal,
    type DbNewTaskType,
    type DbTaskType,
} from "@taskcord/database";

export default class TaskTypeService {
    public async createTaskType(
        taskTypeData: DbNewTaskType,
    ): Promise<DbTaskType> {
        return TaskTypeDal.createTaskType(taskTypeData);
    }

    public async getTaskTypesByProjectId(
        projectId: string,
    ): Promise<DbTaskType[]> {
        return TaskTypeDal.getTaskTypesByProjectId(projectId);
    }

    public async updateTaskType(
        id: string,
        taskTypeData: Partial<DbNewTaskType>,
    ): Promise<DbTaskType | null> {
        return TaskTypeDal.updateTaskType(id, taskTypeData);
    }

    public async deleteTaskType(id: string): Promise<DbTaskType | null> {
        return TaskTypeDal.deleteTaskType(id);
    }

    public async deleteTaskTypeBulk(ids: string[]): Promise<DbTaskType[]> {
        return TaskTypeDal.deleteTaskTypesBulk(ids);
    }
}
