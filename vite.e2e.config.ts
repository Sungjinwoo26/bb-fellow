import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
// Use a separate Worker config directory so user local secrets are never loaded in E2E.
export default defineConfig({plugins:[react(),cloudflare({configPath:'e2e/wrangler.jsonc'})]});
