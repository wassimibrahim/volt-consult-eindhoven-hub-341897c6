
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Fix for AWS SDK which expects global to be defined
    global: 'window',
    // Provide process.env for browser environment
    'process.env': {
      AWS_ACCESS_KEY_ID: JSON.stringify(process.env.AWS_ACCESS_KEY_ID || 'your-access-key'),
      AWS_SECRET_ACCESS_KEY: JSON.stringify(process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key'),
      AWS_REGION: JSON.stringify(process.env.AWS_REGION || 'eu-west-1'),
      AWS_S3_BUCKET: JSON.stringify(process.env.AWS_S3_BUCKET || 'your-bucket-name')
    }
  },
}));
