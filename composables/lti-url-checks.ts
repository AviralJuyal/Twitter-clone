/**
 * LTI LAUNCH CHECKS
 *
 * This file contains functions for checking
 * and identifying the TYPE of the incoming LTI
 * launch request.
 * - Is it an LTI launch? (initial check)
 * - Is it a Deep Link, originating from 3rd party Blackboard, Canvas etc.
 * - Is it originating from LTI Teacher page.
 * - Is it originating from LTI Teacher Component page.
 */

export const useLtiUrlChecks = () => {
  /**
   * Checks if the user has launched directly from LTI deeplink
   *
   * @returns {boolean} Returns true if the user has launched from LTI deeplink
   */
  const isLtiDeeplinkLaunch = (): boolean => {
    /*
     * Check if the user has launched from LTI deeplink. For this we check 2 things:
     * 1. If the user has launched from an LTI workflow
     * 2. If the user has not launched from(lf) LTI teacher dashboard(ltd) or LTI teacher component selection(ltc) page
     */
    const route = useRoute();
    const currentUserInfo = useAuthenticateStore();
    return (
      (currentUserInfo.isLtiSession &&
        ['ltd', 'ltc'].indexOf(route.query.lf as string) === -1) ||
      false
    );
  };

  /*
   * Checks if the user has launched from LTI teacher dashboard(ltd)
   * query.lf = Launched from
   * ltd = LTI Teacher Dashboard
   * @returns {boolean} Returns true if the user has launched from LTI teacher dashboard
   */
  const isLaunchedFromLtiTeacherDashboard = () => {
    return useRoute().query.lf === 'ltd';
  };

  /*
   * Checks if the user has launched from LTI teacher component Selection(ltc)
   * query.lf = Launched from
   * ltc = LTI component selection page
   * @returns {boolean} Returns true if the user has launched from LTI teacher component selection page
   */
  const isLaunchedFromLtiTeacherComponent = () => {
    return useRoute().query.lf === 'ltc';
  };

  return {
    isLtiDeeplinkLaunch: isLtiDeeplinkLaunch,
    isLaunchedFromLtiTeacherDashboard,
    isLaunchedFromLtiTeacherComponent
  };
};
