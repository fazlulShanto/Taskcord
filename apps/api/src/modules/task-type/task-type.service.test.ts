import TaskTypeService from "@/modules/task-type/task-type.service";
import { TaskTypeDal } from "@taskcord/database";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("TaskTypeService CRUD", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("creates task type", async () => {
        const taskType = {
            id: "task-type-id",
            projectId: "project-id",
            creatorId: "creator-id",
            name: "Bug",
            description: "Defect",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const createSpy = vi
            .spyOn(TaskTypeDal, "createTaskType")
            .mockResolvedValue(taskType as never);

        const service = new TaskTypeService();
        const result = await service.createTaskType(taskType as never);

        expect(createSpy).toHaveBeenCalledWith(taskType);
        expect(result).toEqual(taskType);
    });

    it("reads task types by project", async () => {
        const rows = [
            {
                id: "task-type-id",
                projectId: "project-id",
                creatorId: "creator-id",
                name: "Feature",
                description: "Feature work",
                order: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        vi.spyOn(TaskTypeDal, "getTaskTypesByProjectId").mockResolvedValue(
            rows as never,
        );

        const service = new TaskTypeService();
        const result = await service.getTaskTypesByProjectId("project-id");

        expect(result).toEqual(rows);
    });

    it("updates task type", async () => {
        const updated = {
            id: "task-type-id",
            projectId: "project-id",
            creatorId: "creator-id",
            name: "Task",
            description: "General",
            order: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updateSpy = vi
            .spyOn(TaskTypeDal, "updateTaskType")
            .mockResolvedValue(updated as never);

        const service = new TaskTypeService();
        const result = await service.updateTaskType("task-type-id", {
            name: "Task",
            order: 3,
        });

        expect(updateSpy).toHaveBeenCalledWith("task-type-id", {
            name: "Task",
            order: 3,
        });
        expect(result).toEqual(updated);
    });

    it("deletes task type", async () => {
        const deleted = {
            id: "task-type-id",
            projectId: "project-id",
            creatorId: "creator-id",
            name: "Task",
            description: null,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const deleteSpy = vi
            .spyOn(TaskTypeDal, "deleteTaskType")
            .mockResolvedValue(deleted as never);

        const service = new TaskTypeService();
        const result = await service.deleteTaskType("task-type-id");

        expect(deleteSpy).toHaveBeenCalledWith("task-type-id");
        expect(result).toEqual(deleted);
    });
});
