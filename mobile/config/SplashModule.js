import { requireOptionalNativeModule } from 'expo-modules-core';
const SplashModule = requireOptionalNativeModule('ExpoSplashScreen');

// Patch missing internal methods
SplashModule.internalPreventAutoHideAsync =
	SplashModule.internalPreventAutoHideAsync ||
	(async () => {
		 console.warn(
		 	'Fallback: internalPreventAutoHideAsync not defined. Using preventAutoHideAsync instead.',
		 );
		return SplashModule.preventAutoHideAsync ? await SplashModule.preventAutoHideAsync() : false;
	});

SplashModule.internalMaybeHideAsync =
	SplashModule.internalMaybeHideAsync ||
	(async () => {
		 console.warn('Fallback: internalMaybeHideAsync not defined. Using hideAsync instead.');
		return SplashModule.hideAsync ? await SplashModule.hideAsync() : false;
	});

export default SplashModule;