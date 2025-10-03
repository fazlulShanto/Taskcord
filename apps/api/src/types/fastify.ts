import type { FastifyReply } from "fastify";
import type { JwtPayload } from "@/plugins/jwt";
// inspired from https://stackoverflow.com/questions/71829049/role-based-authentication-system-fastify

declare module "fastify" {
  /**
   * Interface to extend FastifyRequest to add the jwtUser property
   */
  interface FastifyRequest {
    jwtUser: JwtPayload;
  }
  /**
   * Type function to extend FastifyInstance to work with hook authentication
   * onRequest: [fastify.authenticate] defined at src\plugins\jwtVerification.ts
   */
  type JwtAuth = (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;

  /**
   * Type function to extend FastifyInstance to work with hook authentorization
   * preHandler: fastify.auth([fastify.authorize]) defined at src\plugins\roleBasedAutorization.ts
   */
  type Authorize = (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;

  /** Apply the extension */
  interface FastifyInstance {
    jwtAuth: JwtAuth;
    authorize: Authorize;
  }

  /**
   * Interface to extend FastifyContextConfig, so the allowedRoles and permissions property can be added to
   * the options.config object in routes using authorization
   */
  interface FastifyContextConfig {
    requiredRoles?: string[];
    requiredPermissions?: string[];
  }
}
