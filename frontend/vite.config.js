import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 로컬 개발용 프록시 — 배포(nginx)와 동일하게 /api 를 백엔드(8080)로 넘김
    // (nginx: /api/books -> /books 와 같은 동작. /api prefix 제거)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
