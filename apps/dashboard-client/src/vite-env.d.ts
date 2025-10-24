/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'production' | 'development' | 'test';
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_DISCORD_BOT_NAME: string;
  readonly VITE_DEV_API_URL: string;
  readonly VITE_PROD_API_URL: string;
  readonly VITE_BOT_INVITATION_URL: string;
  readonly DEV: boolean;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
