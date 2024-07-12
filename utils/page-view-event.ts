import {
  UserEventTypes,
  UserEventRepositories,
  type PageViewEvent,
  type PageViewEventPayload
} from '@c1/dashboard.types.user-events';

// Session key to store the last visited URL for the case of inter app navigation
const SESSION_KEY = 'comprodls.nemo.lastVisitedURL';

// Publish event endpoint
const PUBLISH_EVENT_ENDPOINT = '/api/beacon/publish-event';

/**
 * Captures page view events and sends them to the backend.
 * @param appName - The name of the application.
 */
export const capturePageLoadEvent = (appName: string) => {
  // First time when the app is loaded
  window.addEventListener('load', async () => {
    // Retrieve the last visited URL from session storage for inter app navigation
    const lastVisitedURL = sessionStorage.getItem(SESSION_KEY);
    const oldUrl = lastVisitedURL ? new URL(lastVisitedURL) : null;
    sessionStorage.removeItem(SESSION_KEY);

    if (window.location.href) {
      const newUrl = new URL(window.location.href);
      const webPageEvent: PageViewEvent = _constructPageViewEvent(
        appName,
        newUrl,
        oldUrl
      );

      await _postEventData(webPageEvent);
    }
  });
};

export const captureURLChangeEvent = (appName: string) => {
  // Save the last visited URL in session storage when navigating to another app
  // The app being redirected to will retrieve this URL to construct the page view event
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(SESSION_KEY, window.location.href);
  });

  const router = useRouter();

  let baseUrl = useRuntimeConfig().public.appBaseUrl ?? '';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // Router navigation complete event, retrieve the old and new URL
  router.afterEach(async (to, from) => {
    const oldUrl = new URL(
      `${baseUrl}${from.fullPath}`,
      window.location.origin
    );

    const newUrl = new URL(`${baseUrl}${to.fullPath}`, window.location.origin);

    // Construct the page view event and post data to the backend
    const webPageEvent: PageViewEvent = _constructPageViewEvent(
      appName,
      newUrl,
      oldUrl
    );

    await _postEventData(webPageEvent);
  });
};

const _postEventData = async (eventPayload: PageViewEvent) => {
  try {
    await useFetchHelper().fetch<boolean>(PUBLISH_EVENT_ENDPOINT, {
      method: 'POST',
      body: eventPayload
    });
  } catch (err) {
    console.log('Error publishing event for cavalier page view event. ', err);
  }
};

const _constructPageViewEvent = (
  appName: string,
  newURL: URL,
  oldURL: URL | null
): PageViewEvent => {
  const { userAgent } = window.navigator;
  const { title } = window.document;

  const webPageEvent: PageViewEventPayload = {
    url: newURL.href,
    host: newURL.host,
    path: newURL.pathname,
    origin: oldURL?.href ?? null,
    title,
    user_agent: userAgent,
    app: appName
  };

  return {
    type: UserEventTypes.PAGE_VIEWED,
    repository: UserEventRepositories.CAVALIER,
    data: webPageEvent
  };
};
