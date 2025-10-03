import dotenv from "dotenv";

dotenv.config();

export const getPostgresUrl = (): string | undefined => {
  const currentEnv = process.env.NODE_ENV || "local";
  if (currentEnv === "prod") {
    return process.env.PG_DB_URL_PROD;
  }
  return process.env.PG_DB_URL_LOCAL;
};

export const getCurrentEnv = (): string => {
  return process.env.NODE_ENV || "local";
};
