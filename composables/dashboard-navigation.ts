// Composable functions to help with navigation within the dashboard APP
export const useDashboardNavigation = () => {
  /**
   * Navigates to the previous page if the previous page is from C1.
   * @param fallbackUrl - URL to navigate to, if the previous page is not from C1
   *  - If not provided, navigates to the home page.
   */
  const navigateToPreviousPage = async (fallbackUrl?: string) => {
    // Get the document referrer and window location
    const docReferrer = document.referrer && new URL(document.referrer);
    const windowLoc = new URL(window.location.href);

    // Check if the previous page is from C1
    // - Exclude login page redirection scenario
    const isPreviousUrlFromC1 =
      docReferrer &&
      windowLoc &&
      docReferrer.origin === windowLoc.origin &&
      !docReferrer.href.includes('/login?rurl');

    if (isPreviousUrlFromC1) {
      window.history.back();
    } else if (fallbackUrl) {
      await navigateTo({ path: fallbackUrl });
    } else {
      await navigateTo({ path: '/' });
    }
  };

  /**
   * Navigate to the onboarding app with the specified path parameters and options.
   * @param pathParams The path parameters for the onboarding app.
   * @param options The options for navigation.
   */
  const navigateToOnboardingApp = (
    pathParams: string[],
    options?: { queryParams: string[] }
  ) => {
    navigateToApp('onboarding', pathParams, options);
  };

  /**
   * Navigates to the admin app with the specified path parameters and options.
   * @param pathParams The path parameters for the admin app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToAdminApp = (pathParams: any[], options: any = null) => {
    navigateToApp('admin', pathParams, options);
  };

  /**
   * Navigates to the ielts app with the specified path parameters and options.
   * @param pathParams The path parameters for the ielts app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToIeltsApp = (pathParams: any[], options: any = null) => {
    navigateToApp('ielts', pathParams, options);
  };

  /**
   * Navigates to the admin app with the specified path parameters and options.
   * @param pathParams The path parameters for the mosaic app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToMosaicApp = (pathParams: any[], options: any = null) => {
    localStorage.setItem('mosaicCallerAppURL', window.location.href);
    navigateToApp('mosaic', pathParams, options);
  };

  /**
   * Navigates to the learning path app with the specified path parameters and options.
   * @param pathParams The path parameters for the learningPath app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToLearningPathApp = (
    pathParams: any[],
    options: any = null
  ) => {
    navigateToApp('learningPath', pathParams, options);
  };

  /**
   * Navigates to the class app with the specified path parameters and options.
   * @param pathParams The path parameters for the class app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToClassApp = (pathParams: any[], options: any = null) => {
    navigateToApp('class', pathParams, options);
  };

  /**
   * Navigates to the foc app with the specified path parameters and options.
   * @param pathParams The path parameters for the foc app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToFocApp = (pathParams: any[], options: any = null) => {
    navigateToApp('foc', pathParams, options);
  };

  /**
   * Navigates to the nlp app with the specified path parameters and options.
   * @param pathParams The path parameters for the nlp app.
   * @param options The options for navigation. Default value is null.
   */
  const navigateToNlpApp = (pathParams: any[], options: any = null) => {
    navigateToApp('nlp', pathParams, options);
  };

  /**
   * Navigates to the specified app with the specified path parameters and options.
   * @param appType
   * @param pathParams
   * @param options
   */
  const navigateToApp = (
    appType: string,
    pathParams: any[],
    options: any = null
  ) => {
    const appUrl = (
      useRuntimeConfig().public.microapps.urlContracts as {
        [key: string]: string;
      }
    )[appType];
    navigateToMicroAppClientOnly(pathParams, appUrl, options);
  };

  /**
   * Funtion to navigate to the micro app client only
   * @param pathParams
   * @param appUrl
   * @param options
   */
  const navigateToMicroAppClientOnly = (
    pathParams: string[],
    appUrl: string,
    options?: {
      queryParams: string[];
    }
  ) => {
    const url = constructMicroAppUrl(pathParams, appUrl, options);

    window.location.href = url;
  };

  /**
   * Function to construct the micro app url
   */
  const constructMicroAppUrl = (
    pathParams: string[],
    appUrl: string,
    options?: {
      queryParams: string[];
    }
  ): string => {
    appUrl += pathParams.join('/');

    if (options?.queryParams) {
      for (const param in options.queryParams) {
        let queryParamJoinOperator = '&';
        if (appUrl.indexOf('?') == -1) {
          queryParamJoinOperator = '?';
        }

        appUrl +=
          queryParamJoinOperator + param + '=' + options.queryParams[param];
      }
    }

    return appUrl;
  };

  return {
    navigateToPreviousPage,
    navigateToAdminApp,
    navigateToIeltsApp,
    navigateToMosaicApp,
    navigateToLearningPathApp,
    navigateToClassApp,
    navigateToFocApp,
    navigateToNlpApp,
    navigateToOnboardingApp
  };
};
