// @ts-nocheck
export const useNavigation = () => {
  const navigateToMicroAppClientOnly = (
    pathParams,
    appUrl: string,
    options?
  ) => {
    const url = constructMicroAppUrl(pathParams, appUrl, options);

    window.location.href = url;
  };

  const constructMicroAppUrl = (
    pathParams,
    appUrl: string,
    options?
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

  const getRoleBaseDashboardPath = (role: string): string => {
    const map = {
      student: 'learner/dashboard',
      teacher: 'teacher/dashboard',
      parent: 'parent/dashboard',
      admin: 'admin/dashboard',
      superadmin: 'support-admin/dashboard'
    };

    return map[role];
  };

  return {
    navigateToMicroAppClientOnly,
    getRoleBaseDashboardPath,
    constructMicroAppUrl
  };
};
