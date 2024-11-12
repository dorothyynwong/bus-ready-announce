export default {
    "expo": {
      "name": "my-bus-is-coming",
      "slug": "my-bus-is-coming",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/images/icon.png",
      "scheme": "myapp",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "ios": {
        "supportsTablet": true
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
        "package": "com.dorothywyn.mybusiscoming",
        "googleServicesFile": process.env.GOOGLE_SERVICES_JSON 
      },
      "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/favicon.png"
      },
      "plugins": [
        "expo-router"
      ],
      "experiments": {
        "typedRoutes": true
      },
      "extra": {
        "eas": {
          "projectId": "f1610ac8-f69f-48f0-91aa-712efec7fb0b"
        }
      }
    }
  }
  