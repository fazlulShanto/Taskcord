export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "local" | "staging" | "prod";
      LOCAL_BACKEND_HOST_URL: string;
      REMOTE_BACKEND_HOST_URL: string;
    }
  }
}
