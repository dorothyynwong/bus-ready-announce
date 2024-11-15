# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Setup Firebase and EAS

- [Step by step guide] (https://docs.expo.dev/push-notifications/overview/,
https://docs.expo.dev/push-notifications/fcm-credentials/)

You will need :
- EAS account
- Firebase account 
- projectId for a expo push token to use push notifications

After getting the google services keys:
1. upload google-services.json as expo secrets
2. google-services.json to be placed in root

## Login to EAS
```bash
eas login
```

## Build to EAS for development or Expo Go testing
```bash
eas build --platform android --profile development
```

### Build to EAS for preview testing as APK, background tasks can be tested in this way only

1. make sure google-services.json is in EAS secrets
```bash
eas build --platform android --profile preview
```