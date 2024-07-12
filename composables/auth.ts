// @ts-nocheck
import { useLocalStorage } from './localstorage';
import { useThemeService } from './theme';

const { navigateToMicroAppClientOnly } = useNavigation();
const { getGigyaUserData, gigyaLogout, getJWT } = useGigyaSession();

export const useAuthService = () => {
  const { resetThemeToDefault } = useThemeService();

  let rurl: string;
  const { userLoggedOut } = useLocalStorage();

  const logOut = () => {
    return $fetch('/apigateway/logout', { method: 'POST' }).then((res: any) => {
      gigyaLogout();
      sessionStorage.removeItem(
        useRuntimeConfig().public.sessionStorage['userAccount']
      );
      if (res['success']) {
        setTimeout(() => {
          localStorage.setItem(userLoggedOut, 'true');
        }, 500);
        resetThemeToDefault();
      }
      return res;
    });
  };

  const setUserData = (user: any) => {
    useState('userData').value = user;
  };

  const getUserData = () => {
    return useState('userData').value;
  };

  // cleans userData
  const clearUserdata = () => {
    useState('userData').value = false;
  };

  const isUserAuthenticated = async () => {
    let userDataResponse: any;
    const userData = sessionStorage.getItem(
      useRuntimeConfig().public.sessionStorage['userAccount']
    );

    if (userData) {
      userDataResponse = {
        userAuthenticated: true,
        user: JSON.parse(userData)
      };
    } else {
      userDataResponse = await $fetch('/apigateway/authenticated');
    }

    setDataFromUserAuthenticatedCall(userDataResponse);
    return userDataResponse;
  };

  const setDataFromUserAuthenticatedCall = (data: any) => {
    useState('isUserAuthenticationChecked').value = true;
    if (data.userAuthenticated) {
      useState('userData').value = data.user;
    }
    useState('isUserAuthenticatedCall').value = undefined;
  };

  // function to not trigger multiple isUserAuthenticated calls
  const checkUserAuthenticatedCache = async () => {
    const isUserAuthenticatedCall: any = useState('isUserAuthenticatedCall');
    if (!useState('isUserAuthenticationChecked').value) {
      if (!isUserAuthenticatedCall.value) {
        const res = await isUserAuthenticated();
        isUserAuthenticatedCall.value = res.user;
      }
      return isUserAuthenticatedCall.value;
    } else {
      return Promise.resolve(useState('userData').value);
    }
  };

  const getUserDataFromSession = async () => {
    if (!useState('isUserAuthenticationChecked').value) {
      const res: any = await isUserAuthenticated();
      if (res.userAuthenticated) {
        useState('isUserAuthenticationChecked').value = true;
        setUserData(res.user);
        sessionStorage.setItem(
          useRuntimeConfig().public.sessionStorage['userAccount'],
          JSON.stringify(res.user)
        );
      }
    }
    return getUserData();
  };

  const setIsGigyaLoaded = (value: boolean) => {
    useState('isGigyaLoaded').value = value;
  };

  const checkGigyaAndDlsSession = async () => {
    //Both guard and appcomponent are calling this function and setting 1 variable each in this service
    //When both variables are true then logoutGigyaOrExpressServer funtion is called to check both sessions.
    //Check the server session and gigya session only if gigya is loaded and user authentication is checked
    if (
      useState('isUserAuthenticationChecked').value &&
      useState('isGigyaLoaded').value
    ) {
      const gigyaData = await getGigyaUserData();
      await gigyaAndDlsSessionValidation(gigyaData, useState('userData').value);
      const user = {
        country: gigyaData?.profile?.country,
        userName: gigyaData?.loginIDs?.username,
        parentUUID: gigyaData?.data?.parentUID,
        loginProvider: gigyaData?.loginProvider
      };
      const authenticateStore = useAuthenticateStore();
      authenticateStore.loadFromSAPCDC(user);
    }
    return true;
  };

  const gigyaAndDlsSessionValidation = async (
    gigyaSessionExists,
    serverSessionExists
  ) => {
    if (gigyaSessionExists && serverSessionExists) {
      if (gigyaSessionExists.UID == serverSessionExists.extUserId) {
        return true;
      } else {
        logOut()
          .then(() => {
            return gigyaLogout();
          })
          .then(() => {
            navigateToRurl();
          });
      }
    } else if (!gigyaSessionExists && serverSessionExists) {
      //end backend session and navigate to home page
      logOut().then(() => {
        // On Logout navigate to home page
        navigateToRurl();
      });
    } else if (gigyaSessionExists && !serverSessionExists) {
      const params = {
        ...gigyaSessionExists,
        jwtToVerify: await getJWT()
      };
      await $fetch('/apigateway/login', {
        method: 'POST',
        body: params
      });

      window.location.reload();
    } else if (useRuntimeConfig().public.APP_NAME !== 'onboarding') {
      navigateToRurl();
    }
  };

  const verifyUser = async (data: any) => {
    return await $fetch('/apigateway/gigya/verifyUser', {
      method: 'POST',
      body: data
    });
  };

  const navigateToRurl = () => {
    //Navigate to Home if user is unauthenticated
    if (rurl) {
      navigateToMicroAppClientOnly(
        ['login'],
        useRuntimeConfig().public.microapps['urlContracts'].onboarding,
        {
          queryParams: { rurl: encodeURIComponent(rurl) }
        }
      );
    } else {
      navigateToMicroAppClientOnly(
        ['login'],
        useRuntimeConfig().public.microapps['urlContracts'].onboarding
      );
    }
  };

  return {
    setIsGigyaLoaded,
    checkGigyaAndDlsSession,
    isUserAuthenticated,
    getUserDataFromSession,
    logOut,
    verifyUser,
    clearUserdata,
    setUserData,
    getUserData,
    checkUserAuthenticatedCache,
    setDataFromUserAuthenticatedCall
  };
};
