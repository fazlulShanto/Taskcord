import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const getApiStatusResponseSchema = z
    .object({
        status: z.string(),
    })
    .meta({ $id: "getApiStatusResponseSchema" });

const getServerHardwareInfoResponseSchema = z
    .object({
        uptime: z.number(),
        platform: z.string(),
        arch: z.string(),
        hostname: z.string(),
        type: z.string(),
        release: z.string(),
        totalmem: z.number(),
        freemem: z.number(),
        runtime: z.string(),
        version: z.string(),
        cpus: z.array(
            z.object({
                model: z.string(),
                speed: z.number(),
                times: z.object({
                    user: z.number(),
                    nice: z.number(),
                    sys: z.number(),
                    idle: z.number(),
                    irq: z.number(),
                }),
            })
        ),
    })
    .meta({ $id: "getServerHardwareInfoResponseSchema" });

const getApiUptimeResponseSchema = z
    .object({
        uptime: z.number(),
        message: z.string(),
        date: z.string(),
    })
    .meta({ $id: "getApiUptimeResponseSchema" });

export type GetApiStatusResponse = z.infer<typeof getApiStatusResponseSchema>;

export type GetServerHardwareInfoResponse = z.infer<
    typeof getServerHardwareInfoResponseSchema
>;

export type GetApiUptimeResponse = z.infer<typeof getApiUptimeResponseSchema>;

export const zodUtilitySchemas = zodSchemasToJSONSchema([
    getApiStatusResponseSchema,
    getServerHardwareInfoResponseSchema,
    getApiUptimeResponseSchema,
]);
