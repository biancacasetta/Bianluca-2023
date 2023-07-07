import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bianluca.pps',
  appName: 'Bianluca',
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
    },
    LocalNotifications: {
      iconColor: "#488AFF",
    },
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "123281409180-od93cdm279bejo3uhulpg1po4ti99nls.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true,
      "androidClientId": "123281409180-od93cdm279bejo3uhulpg1po4ti99nls.apps.googleusercontent.com"
    }
  }
};

export default config;
