/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Backend API base URL – set in .env as VITE_API_BASE_URL */
    readonly VITE_API_BASE_URL: string;
    // Add any other VITE_ variables you need, e.g.
    // readonly VITE_SOME_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}