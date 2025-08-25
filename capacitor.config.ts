import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.15309498f12f49cca339e6df25d1a05f',
  appName: 'fast-swim-club-dashboard',
  webDir: 'dist',
  server: {
    url: 'https://15309498-f12f-49cc-a339-e6df25d1a05f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0077FF',
      showSpinner: false
    }
  }
};

export default config;