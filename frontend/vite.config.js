import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 로컬 개발: /api 요청을 백엔드(8080)로 프록시 (통합 배포 시엔 같은 서버라 불필요)
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
