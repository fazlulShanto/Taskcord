// packages/types/src/schemaHelper.ts
import { toJSONSchema, type ZodType } from "zod/v4";
import { JSONSchema } from "zod/v4/core";

export function zodSchemasToJSONSchema(
    schemas: ZodType[]
): JSONSchema.JSONSchema[] {
    const jsonSchemas = schemas.map((schema) => {
        return toJSONSchema(schema, {
            target: "draft-7", // Fastify acccepts this format only, and it isn't the default for Zod
            unrepresentable: "any", // Accepts some types impossible to represent, check the docs for more info
        });
    });

    const enforceTuples = (obj: any) => {
        if (obj && typeof obj === "object") {
            if ("items" in obj && Array.isArray(obj.items)) {
                const len = obj.items.length;
                obj.minItems = len;
                obj.maxItems = len;
            }

            for (const key of Object.keys(obj)) {
                enforceTuples(obj[key]);
            }
        }
    };

    for (const schema of jsonSchemas) {
        enforceTuples(schema);
    }

    return jsonSchemas;
}
