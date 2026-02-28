import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectMilestone = {
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
};

const createMilestoneSchema = z
    .object({
        title: z.string(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.string().optional(),
    })
    .meta({ $id: "createMilestoneSchema" });

const updateMilestoneSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.string().optional(),
    })
    .meta({ $id: "updateMilestoneSchema" });

const milestoneResponseSchema = z
    .object({
        milestone: z.object(ProjectMilestone),
    })
    .meta({ $id: "milestoneResponse" });

const milestonesResponseSchema = z
    .object({
        milestones: z.array(z.object(ProjectMilestone)),
    })
    .meta({ $id: "milestonesResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "milestoneErrorResponse" });

const milestoneSchemaWithId = z
    .object({
        milestoneId: z.string().uuid(),
    })
    .meta({ $id: "milestoneSchemaWithId" });

const milestoneProjectIdParamsSchema = z
    .object({
        projectId: z.string().uuid(),
    })
    .meta({ $id: "milestoneProjectIdParams" });

const milestoneParamsSchema = z
    .object({
        projectId: z.string().uuid(),
        milestoneId: z.string().uuid(),
    })
    .meta({ $id: "milestoneParams" });

export type CreateMilestone = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestone = z.infer<typeof updateMilestoneSchema>;
export type MilestoneProjectIdParams = z.infer<
    typeof milestoneProjectIdParamsSchema
>;
export type MilestoneParams = z.infer<typeof milestoneParamsSchema>;

export const zodMilestoneSchemas = zodSchemasToJSONSchema([
    createMilestoneSchema,
    updateMilestoneSchema,
    milestoneResponseSchema,
    milestonesResponseSchema,
    errorResponseSchema,
    milestoneSchemaWithId,
    milestoneProjectIdParamsSchema,
    milestoneParamsSchema,
]);
