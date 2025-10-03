import { default as fastifyPlugin } from "fastify-plugin";
import { default as fastifySwagger } from "@fastify/swagger";
import { default as fastifySwaggerUI } from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifySwagger, {
      mode: "dynamic",
      openapi: {
        info: {
          title: "Taskcord API",
          version: "0.0.5",
        },
      },
    });
    await fastify.register(fastifySwaggerUI, {
      routePrefix: "/api/docs",
      initOAuth: {},
      logLevel: "error",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
        persistAuthorization: true,
      },
      staticCSP: true,
      transformSpecification: (swaggerObject: any) => {
        swaggerObject.components = {
          ...swaggerObject.components,
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter your JWT token in the format: Bearer <token>",
            },
          },
        };

        // Add global security requirement
        swaggerObject.security = [
          {
            bearerAuth: [],
          },
        ];

        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
  },
  {
    dependencies: ["env-config"],
    fastify: "5.x",
  },
);
