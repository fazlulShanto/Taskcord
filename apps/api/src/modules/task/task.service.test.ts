import TaskService from "@/modules/task/task.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockTaskDal } = vi.hoisted(() => ({
    mockTaskDal: {
        createTask: vi.fn(),
        getTaskById: vi.fn(),
        getTasksByProjectId: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
    },
}));

vi.mock("@taskcord/database", async () => {
    const actual = await vi.importActual<object>("@taskcord/database");
    return {
        ...actual,
        TaskDal: mockTaskDal,
    };
});

describe("TaskService CRUD", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockTaskDal.createTask.mockReset();
        mockTaskDal.getTaskById.mockReset();
        mockTaskDal.getTasksByProjectId.mockReset();
        mockTaskDal.updateTask.mockReset();
        mockTaskDal.deleteTask.mockReset();
    });

    it("creates task", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: "Prepare pipeline",
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockTaskDal.createTask.mockResolvedValue(task as never);

        const service = new TaskService();
        const result = await service.createTask(task as never);

        expect(mockTaskDal.createTask).toHaveBeenCalledWith(task);
        expect(result).toEqual(task);
    });

    it("reads task by id", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: null,
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockTaskDal.getTaskById.mockResolvedValue(task as never);

        const service = new TaskService();
        const result = await service.getTaskById(task.id);

        expect(mockTaskDal.getTaskById).toHaveBeenCalledWith(task.id);
        expect(result).toEqual(task);
    });

    it("reads tasks by project", async () => {
        const tasks = [
            {
                id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
                projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
                title: "Setup CI",
                description: null,
                creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
                status: "TODO",
                priority: "MEDIUM",
                milestoneId: null,
                assignees: [],
                dueDate: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockTaskDal.getTasksByProjectId.mockResolvedValue(tasks as never);

        const service = new TaskService();
        const result = await service.getTasksByProjectId(tasks[0].projectId);

        expect(mockTaskDal.getTasksByProjectId).toHaveBeenCalledWith(
            tasks[0].projectId,
        );
        expect(result).toEqual(tasks);
    });

    it("updates task", async () => {
        const updatedTask = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI Updated",
            description: "Pipeline and checks",
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "IN_PROGRESS",
            priority: "HIGH",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockTaskDal.updateTask.mockResolvedValue(updatedTask as never);

        const service = new TaskService();
        const result = await service.updateTask(updatedTask.id, {
            title: "Setup CI Updated",
            status: "IN_PROGRESS",
            priority: "HIGH",
        });

        expect(mockTaskDal.updateTask).toHaveBeenCalledWith(updatedTask.id, {
            title: "Setup CI Updated",
            status: "IN_PROGRESS",
            priority: "HIGH",
        });
        expect(result).toEqual(updatedTask);
    });

    it("deletes task", async () => {
        const deletedTask = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: null,
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockTaskDal.deleteTask.mockResolvedValue(deletedTask as never);

        const service = new TaskService();
        const result = await service.deleteTask(deletedTask.id);

        expect(mockTaskDal.deleteTask).toHaveBeenCalledWith(deletedTask.id);
        expect(result).toEqual(deletedTask);
    });
});
