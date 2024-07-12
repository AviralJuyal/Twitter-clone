export const useLocalStorage = () => {
  return {
    lang: 'comprodls.nemo.selected-locale',
    cookiesAccepted: 'comprodls.nemo.cookiesAccepted',
    adminLastVisitedRoute: 'comprodls.nemo.admin.lastVisitedRoute-user.',
    adminSelectedView: 'comprodls.nemo.admin.selectedView-user.', // To navigate to teacher dashboard or admin dashboard in case of admin (value "teacher/admin")
    userLoggedOut: 'comprodls.nemo.userLoggedOut',
    userLoggedIn: 'comprodls.nemo.userLoggedIn',
    invitationExpired: 'comprodls.nemo.invitationExpired-user.',
    userPreferences: (userid: string) =>
      'comprodls.nemo.user.' + userid + '.preferences',
    messageBanner: 'comprodls.nemo.messageBanner.',
    passwordResetSuccessful: 'comprodls.nemo.passwordResetSuccessful-user.',
    loggedInUserRole: 'comprodls.nemo.loggedInUserRole',
    downloadDesktopAppBannerConfig: (userid: string) =>
      'comprodls.nemo.desktopAppBanner.' + userid,
    debugPreference: 'comprodls.nemo.debugPreference',
    externalResourcesVisitedLinks:
      'comprodls.nemo.externalResources.visitedLinks',
    informationBanner: 'comprodls.nemo.informationBanner',
    nps: (userid: string) => 'comprodls.nemo.user.' + userid + '.nps',
    onboarding: (userid: string) =>
      'comprodls.nemo.user.' + userid + '.onboarding',
    storeURL: 'comprodls.nemo.englishShopURL',
    login: (userid: string) => 'comprodls.nemo.user.' + userid + '.login',
    classEnded: 'comprodls.nemo.classEnded-user.'
  };
};
