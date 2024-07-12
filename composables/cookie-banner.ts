// Setting default value false otherwise due to SSR
// cookie banner is flickers everytime user reloads the page

// even if user has accepted cookies
const showCookiesBanner = ref(false);

export const useCookieBanner = () => {
  const { cookiesAccepted } = useLocalStorage();

  const calcCookiesBannerState = () => {
    if (process.client) {
      if (localStorage.getItem(cookiesAccepted) != 'true')
        showCookiesBanner.value = true;
    } else {
      showCookiesBanner.value = false;
    }
  };

  const acceptCookies = () => {
    showCookiesBanner.value = false;
    localStorage.setItem(cookiesAccepted, 'true');
  };

  const getCookiesBannerState = () => {
    return showCookiesBanner.value;
  };

  return { calcCookiesBannerState, acceptCookies, getCookiesBannerState };
};
