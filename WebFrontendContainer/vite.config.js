import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig({
  plugins: [react()],
  // Ensure dev server matches preview requirements
  server: {
    // Use env PORT if provided, else default to 3002
    port: Number(process.env.PORT) || 3002,
    // host true makes it listen on 0.0.0.0
    host: true,
  },
});
