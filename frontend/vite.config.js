import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/AddYourBooks/',
  plugins: [react()],
  build : {
    rollupOptions: {
      output:{
        manualChunks(id){
          if(id.includes('node_modules')){
            return 'vendor';
          }
        },
      },
    },
  }

})
