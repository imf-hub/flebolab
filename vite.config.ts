import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{chunkSizeWarningLimit:1400,rollupOptions:{output:{onlyExplicitManualChunks:true,manualChunks(id){if(/node_modules\/(react|react-dom|scheduler)\//.test(id))return 'react-core';if(id.includes('node_modules/three/')||id.includes('@react-three'))return 'anatomy-engine';if(id.includes('openseadragon'))return 'image-viewer';}}}},server:{host:'127.0.0.1',port:5173},preview:{host:'127.0.0.1',port:4173}});
