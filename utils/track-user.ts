/**
 * Utility functions for tracking user events.
 */

// IMPORTS

//Types - Events
import {
  UserEventTypes,
  UserEventRepositories
} from '@c1/dashboard.types.user-events';

import type {
  ContentViewedEventArgs,
  TrackUserEventPayload,
  TrackUserEvent
} from '@c1/dashboard.types.user-events';

import { nanoid } from 'nanoid';
import { ExternalData } from '@c1/s3eventlog';

// Internal type to capture the details of the event.
type EventDetails = {
  user: {
    extUserId: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  productCode?: string;
  classId?: string;
  spaceId?: string;
  page: string;
};

/**
 * Generates a content viewed event for concurrent user tracking, based on the provided event details.
 * @param eventDetails - The details of the product viewed event.
 * @returns The generated product viewed event.
 */
export function constructContentViewedEventArgs(
  eventDetails: EventDetails
): ContentViewedEventArgs {
  return {
    data: {
      actorid: eventDetails.user.extUserId,
      os: getOsName(),
      timestamp: Date.now(),
      verb: 'navigated',
      xapi: false,
      user_role: eventDetails.user.role,
      ua: navigator.userAgent,
      vw: _getViewPortWidth(),
      vh: _getViewPortHeight(),
      navigated: {
        to: {
          page: eventDetails.page as string,
          url: window.location.href
        }
      },
      ...(eventDetails.spaceId && { spaceId: eventDetails.spaceId }),
      ...(eventDetails.productCode && {
        product_code: eventDetails.productCode
      }),
      ...(eventDetails.classId && { class_id: eventDetails.classId })
    },
    action: 'START',
    category: 'CUSTOM_SESSION_CONTENT_VIEWED',
    type: 'learning',
    originatorid: eventDetails.user.extUserId
  };
}

/**
 * Logs the provided events array using the specified user event type.
 * @param eventsArray - The array of product viewed events to log.
 * @param userEventType - The user event type.
 */
export function logTrackUserEvents(
  eventsArray: ContentViewedEventArgs[],
  userEventType: UserEventTypes.CONTENT_VIEWED
): void {
  const event = _constructEvent(eventsArray, userEventType);
  let baseUrl = '/';

  if (
    useRuntimeConfig().public.appEnv !== 'local' &&
    useRuntimeConfig().public.appBaseUrl
  ) {
    baseUrl = useRuntimeConfig().public.appBaseUrl;
  }

  const publishEventUrl = new URL(
    baseUrl + 'api/beacon/publish-event',
    window.location.origin
  );

  const externalDataInstance = new ExternalData();
  externalDataInstance.sendBeacon(publishEventUrl, event);
}

function _constructEvent(
  eventsArray: ContentViewedEventArgs[],
  userEventType: UserEventTypes.CONTENT_VIEWED
): TrackUserEvent {
  const event: TrackUserEvent = {
    type: userEventType,
    repository: UserEventRepositories.S3_EXTERNAL_BUCKET,
    data: {
      feature: 'user-sessions',
      data: [] as TrackUserEventPayload[]
    }
  };

  for (const content of eventsArray) {
    if (!content.category) continue;
    event.data.data.push({
      id: nanoid(16),
      content,
      opts: {
        'folder-structure': `${content.data.actorid}/${_getDate(content.data.timestamp)}/${content.category}`
      }
    });
  }

  return event;
}

/**
 * Returns the viewport width of the current window.
 * @returns The viewport width.
 */
function _getViewPortWidth(): number {
  return Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
}

/**
 * Returns the viewport height of the current window.
 * @returns The viewport height.
 */
function _getViewPortHeight(): number {
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
}

/**
 * Returns the date in the format 'YYYY-MM-DD' based on the provided timestamp.
 * @param timestamp - The timestamp.
 * @returns The formatted date.
 */
function _getDate(timestamp: number): string {
  const nowDate = new Date(timestamp);
  return (
    nowDate.getFullYear() +
    '-' +
    (nowDate.getMonth() + 1) +
    '-' +
    nowDate.getDate()
  );
}
