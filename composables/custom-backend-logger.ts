export const useCustomBackendLogger = () => {
  const logInfoToBackend = async (data: any) =>
    await $fetch('/apigateway/logger', {
      method: 'POST',
      body: data
    });
  return {
    logInfoToBackend
  };
};
