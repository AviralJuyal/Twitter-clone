const { navigateToMicroAppClientOnly } = useNavigation();
export function useInterAppNavigationService() {
  /**
   * Navigates to the onboarding app with the specified path parameters and options.
   * @param pathParams The path parameters for the navigation.
   * @param options The options for the navigation.
   */
  const navigateToOnboardingApp = (pathParams: any[], options: any = null) => {
    const appType =
      sessionStorage.getItem('login-redirect-2023') === 'true'
        ? 'onboarding2023'
        : 'onboarding';
    navigateToApp(appType, pathParams, options);
  };

  interface AppUrls {
    [key: string]: string;
  }

  const navigateToApp = (
    appType: string,
    pathParams: any[],
    options: any = null
  ) => {
    const appUrl = (
      useRuntimeConfig().public.microapps.urlContracts as AppUrls
    )[appType];
    navigateToMicroAppClientOnly(pathParams, appUrl, options);
  };

  return {
    navigateToOnboardingApp
  };
}
