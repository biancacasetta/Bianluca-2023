import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'La_Comanda_PPS',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1200,
      "launchAutoHide": true,
      "launchFadeOutDuration": 1200,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": true
    }
  }
};

export default config;
