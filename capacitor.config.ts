import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mz.org.csaude.sespclinicalsummary',
  appName: 'SESP Clinical Summary',
  webDir: 'src-capacitor/www',
  server: {
    androidScheme: 'http',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  
};

export default config;
