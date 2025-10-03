import type { FastifyInstance } from "fastify";
import UtilityController from "./utility.controller";
import { $ref } from "./utility.schema";
import UtilityService from "./utility.service";

export default function UtilityRoute(fastify: FastifyInstance) {
  const utilityController = new UtilityController(new UtilityService());

  fastify.get(
    "/uptime",
    {
      schema: {
        tags: ["Utility"],
        description: "Get the uptime of the API",
        response: {
          200: $ref("getApiUptimeResponseSchema"),
        },
      },
    },
    utilityController.getApiUptimeHandler.bind(utilityController),
  );

  fastify.get(
    "/health-check",
    {
      schema: {
        tags: ["Utility"],
        description: "Get the status of the API if it's running",
        response: {
          200: $ref("getApiStatusResponseSchema"),
        },
      },
    },
    utilityController.getApiStatusHandler.bind(utilityController),
  );

  fastify.get(
    "/ping",
    {
      schema: {
        tags: ["Utility"],
        description: "Ping the API to check if it's running",
        response: {
          200: $ref("getApiStatusResponseSchema"),
        },
      },
    },
    utilityController.getApiStatusHandler.bind(utilityController),
  );

  fastify.get(
    "/server-info",
    {
      schema: {
        tags: ["Utility"],
        description: "Get the server hardware information",
        response: {
          200: $ref("getServerHardwareInfoResponseSchema"),
        },
      },
    },
    utilityController.getServerHardwareInfoHandler.bind(utilityController),
  );

  fastify.post(
    "/cookie-test",
    {
      schema: {
        tags: ["Utility"],
        description: "Test the cookie",
        body: {
          type: "object",
        },
      },
    },
    utilityController.cookieTestHandler.bind(utilityController),
  );
}
