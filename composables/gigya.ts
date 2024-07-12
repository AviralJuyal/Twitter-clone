// @ts-nocheck
import { createHooks } from 'hookable';
declare let gigya: any;

export const useGigyaSession = () => {
  // Variable to store user data.
  // This is fetched only once from GIGYA and then stored in this variable for further requests
  let userData: any = false;

  // This is used by various angular components to listen to GIGYA load event
  //ongigyaLoad: Subject<any> = new Subject();
  const gigyaLoadedHook = createHooks();
  const GIGYA_LOADED = 'GIGYA_LOADED';

  // return current Gigya user data, if Gigya session is valid
  const getGigyaUserData = (): Promise<any> => {
    return new Promise((resolve) => {
      if (userData) {
        resolve(userData);
        return;
      }

      gigya.accounts.getAccountInfo({
        include: 'identities-active,loginIDs,profile,data,preferences',
        callback: function (res) {
          if (res.errorCode === 0 && res.UID) {
            userData = res;
            userData.c1UserRole = getC1UserRole(res);
          } else {
            userData = false;
          }
          resolve(userData);
        }
      });
    });
  };

  const getUserSAMLData = async (): Promise<any> => {
    return new Promise((resolve) => {
      window.gigya.accounts.getAccountInfo({
        extraProfileFields: 'samlData',
        callback: (res) => {
          resolve(res.profile.samlData);
        }
      });
    });
  };

  // cleans userData
  const clearUserdata = () => {
    userData = false;
  };

  const gigyaLogout = (): Promise<void> => {
    return new Promise((resolve) => {
      gigya.accounts.logout({
        forceProvidersLogout: false,
        callback: () => {
          clearUserdata();
          resolve();
        }
      });
    });
  };

  const subscribeToGigyaLoaded = (callback) => {
    gigyaLoadedHook.hook(GIGYA_LOADED, callback);
  };

  // This function listens to 'gigyaloaded' event on window object
  // and fires true on the 'ongigyaLoad' subject which is used by angular components to paint user data
  const bindGigyaLoadEvent = () => {
    window.addEventListener('gigyaLoaded', async () => {
      await getGigyaUserData();
      gigyaLoadedHook.callHook(GIGYA_LOADED, true);
    });
  };

  const getC1UserRole = (userData) => {
    if (userData?.data?.eduelt?.instituteRole?.length > 0) {
      const nemoInstitute = userData.data.eduelt.instituteRole.find(
        (institute) => institute.platform == 'nemo'
      );
      if (nemoInstitute) return nemoInstitute.role;
    } else if (userData?.data?.nemo?.role) {
      return userData.data.nemo.role;
    } else {
      return '';
    }
  };

  const handleJWTResponse = (
    res: any,
    resolve: (value: string | false) => void
  ) => {
    const jwt = res.errorCode === 0 && res.id_token ? res.id_token : false;
    resolve(jwt);
  };

  const getJWTFromGigya = (): Promise<string | false> => {
    return new Promise((resolve) => {
      window.gigya.accounts.getJWT({
        callback: (res: any) => handleJWTResponse(res, resolve)
      });
    });
  };

  const getJWT = async () => {
    const jwt: string | false = await getJWTFromGigya();
    return jwt;
  };

  return {
    bindGigyaLoadEvent,
    subscribeToGigyaLoaded,
    getGigyaUserData,
    getUserSAMLData,
    gigyaLogout,
    getJWT
  };
};
