/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_PORT: string;
  // add other env variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}