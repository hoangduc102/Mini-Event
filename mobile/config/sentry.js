import * as Sentry from '@sentry/react-native';
//import { DNS_SENTRY } from '@env';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_DNS_SENTRY,
    debug: __DEV__,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    beforeSend(event) {
      return event;
    },
    integrations: [
      Sentry.reactNavigationIntegration(),
    ],
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  });
}; 