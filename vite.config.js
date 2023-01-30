import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : "./",
  plugins: [react()],
  define: {
    "process.env": {},
  },
})
