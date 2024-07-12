export const useNpsBanner = () => {
  // Get the user data from the store
  const userData = useAuthenticateStore();

  // Get the runtime config
  const config = useRuntimeConfig();

  /**
   * Function to check if the NPS banner should be displayed or not.
   *
   * The NPS banner should be displayed to the user if:
   * 1. The user has logged in more than 2 times.
   * 2. The user has not seen the NPS banner in the last 30 days.
   */
  const isDisplayNpsBanner = () => {
    const loginCount = userData && getLoginCount(userData?.userId ?? '');
    let isDisplayNpsBanner = false;
    let npsLocalStorageKey: string;

    if (loginCount > 2 && userData?.userId) {
      npsLocalStorageKey = useLocalStorage().nps(userData?.userId);
      const npsBannerRandomUser = generateRandomNoForNPSBanner(1, 100);

      /**
       * Check if the random number generated is less than the percentage set in the config (100 in our case).
       * So NPS Banner will be shown to all users.
       */
      if (
        npsBannerRandomUser >
        100 - config.public.npsBanner.randomUserPercentage
      ) {
        // Get the last shown timestamp from local storage.
        const npsBannerLastShown = JSON.parse(
          localStorage.getItem(npsLocalStorageKey) || '{}'
        )['lastShown'];

        isDisplayNpsBanner =
          !npsBannerLastShown ||
          (npsBannerLastShown &&
            getDifferenceInTimestamps(npsBannerLastShown) >
              config.public.npsBanner.redisplayTime);
      }
    }
    return isDisplayNpsBanner;
  };

  /**
   * Function to set the last shown timestamp for the NPS banner in local storage.
   */
  const setNpsBannerLastShown = () => {
    if (userData?.userId) {
      const localstorageKey = useLocalStorage().nps(userData?.userId);
      const parsedData = JSON.parse(
        localStorage.getItem(localstorageKey) || '{}'
      );

      // set walkthrough done as true
      parsedData['lastShown'] = new Date().getTime();
      localStorage.setItem(localstorageKey, JSON.stringify(parsedData));
    }
  };

  return {
    isDisplayNpsBanner,
    setNpsBannerLastShown
  };
};

/**
 *  Helper functions
 */

/**
 * Function to generate a random number between a given range.
 */
// https://stackoverflow.com/questions/18230217/javascript-generate-a-random-number-within-a-range-using-crypto-getrandomvalues
const generateRandomNoForNPSBanner = (min = 1, max = 100) => {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);

  const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  return Math.floor(randomNumber * (max - min + 1)) + min;
};

/**
 * Function to get the difference in timestamps between the current time and the last shown timestamp.
 */
const getDifferenceInTimestamps = (lastShownTimeStamp: number) => {
  const timeleft = new Date().getTime() - lastShownTimeStamp;
  // Divide by 1000 to get seconds, then by 60 for minutes, then by 60 for hours, then by 24 for days
  return Math.floor(timeleft / 1000 / 60 / 60 / 24);
};

/**
 * Function to get the login count from local storage.
 * This is required to show NPS banner to only those users,
 *  who have logged in more than 2 times (NEMO-16516)
 */
const getLoginCount = (userId: string) => {
  const loginKey = useLocalStorage().login(userId);
  const loginVal = localStorage.getItem(loginKey);
  const loginObj = loginVal ? JSON.parse(loginVal) : undefined;
  if (loginObj && loginObj.count) {
    return loginObj.count;
  }
};
