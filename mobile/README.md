# MiniEvent Mobile App

Mobile application for the MiniEvent project built with React Native and Expo.

## System Requirements

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Install dependencies:

```bash
cd mobile
npm install or npm install --legacy-peer-deps if you encounter any errors
```

2. Environment configuration:
- Create a `.env` file in the `mobile` directory
- Fill in the required environment variables (EXPO_PUBLIC_FIREBASE_APIKEY, EXPO_PUBLIC_IP_ADDRESS, EXPO_PUBLIC_SENTRY_AUTH_TOKEN, EXPO_PUBLIC_DNS_SENTRY)

## Running the Application

1. Start the backend server first

2. Run the mobile app:

```bash
npx expo
```

After running the above command, you can:
- Scan the QR code using the Expo Go app on your phone
- Press 'a' to open on Android emulator
- Press 'i' to open on iOS simulator (macOS only)

## Project Structure

```
mobile/
├── app/              # Contains screens and navigation (Expo Router)
├── assets/          # Images, fonts and other resources
├── components/      # Reusable components
├── config/         # Application configuration
├── constants/      # Constants and theme
├── store/          # State management (Redux/Context)
├── app.json        # Expo configuration
├── eas.json        # EAS Build configuration
├── babel.config.js # Babel configuration
└── tsconfig.json   # TypeScript configuration
```

## Main Features

- Login/Registration
- Event Management
- Realtime Notifications
- Firebase Integration
- And many more features...

## Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)

## Support

If you encounter any issues or need support, please:
1. Check [issues](https://github.com/hoangduc102/issues)
2. Create a new issue if needed
3. Contact the development team
