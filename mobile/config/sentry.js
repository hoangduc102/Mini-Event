import * as Sentry from '@sentry/react-native';


export const initSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_DNS_SENTRY,
    debug: false,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    beforeSend(event) {
      if (event.level === 'error' || event.level === 'fatal') {
        return event;
      }
      return null;
    },
    integrations: [
      Sentry.reactNavigationIntegration(),
    ],
    tracesSampleRate: 0.2,
    enableNativeCrashHandling: true,
    enableAutoPerformanceTracking: false,
  });
}; 