import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import GlobalUtils from "./src/utils/golabalUtils";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/models/*",
  dialect: "postgresql",
  dbCredentials: {
    url: GlobalUtils.getPostgresUrl()!,
  },
});
