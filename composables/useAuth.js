import { jwtDecode } from "jwt-decode";

export default () => {
  const useAuthToken = () => useState("auth_token");
  const useAuthUser = () => useState("auth_user");
  const useAuthLoading = () => useState("auth_loading", () => true);

  const setToken = (newToken) => {
    const authToken = useAuthToken();
    authToken.value = newToken;
  };

  const setUser = (newUser) => {
    const authUser = useAuthUser();
    authUser.value = newUser;
  };

  const setAuthLoading = (value) => {
    const isLoading = useAuthLoading();
    isLoading.value = value;
  };

  const refreshToken = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch("/api/auth/refresh");
        setToken(data.accessToken);
        // setUser(data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const getUser = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await useFetchApi("/api/auth/user");

        setUser(data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const reRefreshToken = () => {
    try {
      const authToken = useAuthToken().value;

      if (!authToken) return;

      const decodedUser = jwtDecode(authToken);

      if (!decodedUser) return;

      const refreshTime = decodedUser.exp - 60000;

      setTimeout(async () => {
        await refreshToken();
        reRefreshToken();
      }, refreshTime);
    } catch (error) {
      return;
    }
  };

  const initAuth = () => {
    return new Promise(async (resolve, reject) => {
      try {
        setAuthLoading(true);
        await refreshToken();
        await getUser();

        reRefreshToken();
        resolve(true);
      } catch (error) {
        reject(error);
      } finally {
        setAuthLoading(false);
      }
    });
  };

  const login = ({ username, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch("/api/auth/login", {
          method: "POST",
          body: {
            username,
            password,
          },
        });
        // console.log(data);
        setToken(data.accessToken);
        setUser(data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    useAuthUser,
    useAuthToken,
    login,
    initAuth,
    useAuthLoading,
  };
};
