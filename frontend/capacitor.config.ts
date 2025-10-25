import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tidalhack.app',
  appName: 'TidalHack',
  webDir: 'dist',
  server: {
    // Uncomment the following line to use localhost for development
    // url: 'http://localhost:5173',
    // cleartext: true
  }
};

export default config;
