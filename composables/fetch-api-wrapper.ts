// IMPORTS

// NUXT Types
import type { UseFetchOptions } from 'nuxt/app';
import type { FetchOptions as OFetchOptions } from 'ofetch';
import { FetchError } from 'ofetch';

interface FetchOptions<ResponseType> extends UseFetchOptions<ResponseType> {
  /**
   * If an error occurs while processing the request, should the error be fatal?
   * Once the fatal error occurs, NUXT redirects the user to the error.vue which
   * further gives you an option to either redirect the user to the dashboard OR
   * to show a standard error page.
   * Default is false.
   */
  fatal?: boolean;
  /**
   * If a fatal error occurs, define what should be done.
   * Default is 'redirectToDashboard'.
   */
  errorHandlingStrategy?:
    | 'redirectToDashboard'
    | 'showErrorPage'
    | 'showLoader';
  /**
   * Return data in a shallow ref object, this helps improves performance.
   * This approach is suitable if you don't want your data to be deeply reactive.
   * Default is false.
   */
  deep?: boolean;
}

interface CSRFetchOptions extends OFetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

  /**
   * If an error occurs while processing the request, should the error be fatal?
   * Once the fatal error occurs, NUXT redirects the user to the error.vue which
   * further gives you an option to either redirect the user to the dashboard OR
   * to show a standard error page.
   * Default is false.
   */
  fatal?: boolean;

  /**
   * If a fatal error occurs, define what should be done.
   * Default is 'redirectToDashboard'.
   */
  errorHandlingStrategy?:
    | 'redirectToDashboard'
    | 'showErrorPage'
    | 'showLoader';
}

export const useFetchHelper = () => {
  /**
   * Wraps the useFetch composable to make API requests and handle errors.
   * Data fetching composables will perform their asynchronous function on both client and server environments.
   * The data will be fetched on the server and added to the Nuxt payload so it can be passed from server to client without re-fetching the data on client side when the page hydrates.
   * - This is useful for SEO and performance optimization.
   * - useFetch composable is used for handle data fetching without re-fetching or duplicate network calls
   * - useFetch it is a shortcut of useAsyncData + $fetch.
   * - This is SSR friendly
   * UseCase:
   * 1. Call in setup function directly
   * 2. Call in Plugin
   * 3. Call in Route middleware
   * @param url - The URL to make the API request to.
   * @param options - The options for the API request.
   */
  const fetch = async <ResponseType>(
    url: string,
    options: FetchOptions<ResponseType> = { deep: false }
  ) => {
    if (options.deep !== true) {
      /**
       * If the deep is not explicitly set to true, set it to false.
       * - This is done to override the default behaviour of the useFetch in which deep is true by default.
       */
      options.deep = false;
    }

    const response = await useFetch(url, options);

    if (response.error?.value) {
      throw createError({
        statusMessage: response.error.value?.message,
        message: response.error.value?.data?.message,
        statusCode: response.error.value?.statusCode,
        fatal: options.fatal || !!options.errorHandlingStrategy,
        data: {
          errorHandlingStrategy: options.errorHandlingStrategy,
          ...response.error.value?.data
        }
      });
    }

    return response;
  };

  /**
   * Wraps the $fetch composable to make API requests and handle errors.
   * Use for client side fetching where data is not fetched on server.
   * - Use Case:
   * 1. This is used for DEFERRED CALLS made on frontend after Component is mounted.
   * 2. network requests based on user interaction
   * @param url - The URL to make the API request to.
   * @param options - The options for the API request.
   *
   * @returns A promise that resolves to the API response.
   * @throws An error if there is an error in the API response.
   */
  const fetchOnCSR = async <ResponseType>(
    url: string,
    options: CSRFetchOptions = { method: 'GET' }
  ) => {
    try {
      const response: ResponseType | null = await $fetch(url, options);
      return response;
    } catch (error: any) {
      if (error instanceof FetchError) {
        throw createError({
          statusMessage: error.statusMessage,
          message: error.message,
          statusCode: error.statusCode,
          fatal: options.fatal || !!options.errorHandlingStrategy,
          data: {
            errorHandlingStrategy: options.errorHandlingStrategy,
            ...error.data
          }
        });
      } else {
        throw createError(error);
      }
    }
  };

  return { fetch, fetchOnCSR };
};
