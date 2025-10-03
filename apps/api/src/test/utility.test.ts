import { afterAll, beforeAll, expect, test } from "vitest";
import type { FastifyInstance } from "fastify";
import supertest from "supertest";
import type {
  GetApiStatusResponse,
  GetServerHardwareInfoResponse,
} from "@/modules/utility/utility.schema";
import { startServer } from "../server";

let app: FastifyInstance;

beforeAll(async () => {
  app = await startServer();
  await app.ready();
});

test("health check", async () => {
  const response: { body: GetApiStatusResponse } = await supertest(app.server)
    .get("/api/stable/utility/health-check")
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
  expect(response.body).toHaveProperty("status");
  expect(response.body.status).toBe("OK");
});

test("Ping Route", async () => {
  const response: { body: GetApiStatusResponse } = await supertest(app.server)
    .get("/api/stable/utility/ping")
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
  expect(response.body).toHaveProperty("status");
  expect(response.body.status).toBe("OK");
});

test("Server Info", async () => {
  const response: { body: GetServerHardwareInfoResponse } = await supertest(
    app.server,
  )
    .get("/api/stable/utility/server-info")
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(200);
  expect(response.body).toHaveProperty("uptime");
  expect(response.body.uptime).toBeTypeOf("number");
  expect(response.body).toHaveProperty("platform");
  expect(response.body.platform).toBeTypeOf("string");
  expect(response.body).toHaveProperty("arch");
  expect(response.body.arch).toBeTypeOf("string");
  expect(response.body).toHaveProperty("hostname");
  expect(response.body.hostname).toBeTypeOf("string");
  expect(response.body).toHaveProperty("type");
  expect(response.body).toHaveProperty("cpus");
});

afterAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- github ci giving error
  if (app) {
    await app.close();
  }
});
