import type {
  Permission,
  Component,
  Umbrella,
  Bundle
} from '@c1/types.entities';

export function useActivationForEdulog() {
  /**
   * Listen to the Activation by code events and track it via the useActivationEventTrack
   * if all the intended events are received then emit the user:activation-processing-complete event
   */
  const listenForEdulogActivationEvents = (id: string, pushConnection: any) => {
    const { $event } = useNuxtApp();

    //reset event tracker before the subscription
    resetEdulogActivationEventsTracker();
    pushConnection.on(
      {
        accountid: useRuntimeConfig().public.dlsAccountId,
        channel: 'refid.' + id
      },
      (eventContext: any) => {
        const eventBody = eventContext.events && eventContext.events.body;
        useCustomBackendLogger().logInfoToBackend(eventBody);

        if (
          _isRelevantEvent(eventBody, id) &&
          !_isComponentActivationEventReceived(eventBody)
        ) {
          _onActivationEventReceive(eventBody);
          if (eventBody.status == 'success') {
            // check event tracker that product event is already not received
            if (areAllEdulogActivationEventsReceived()) {
              $event('user:activation-processing-complete', {
                userId: id,
                status: 'success'
              });
            } else {
              $event('user:activation-processing-event-recieved', {
                userId: id,
                status: 'success',
                eventsReceivedCount,
                eventsNeededCount
              });
            }
          }
        }
      }
    );
  };

  /**
   * Reset the event tracker
   */

  let productsEventReceived: Record<string, boolean>;
  let eventsReceivedCount: number;
  let eventsNeededCount: number;

  //sets the events needed count to the length of the products array and sets the product event received to false initially
  const updateEventTrackingOnEdulogActivationResponse = (response: {
    bundle: Bundle; //Bundle for which the access code was activated
    permissions: {
      permission: Permission;
      component: Component;
      umbrella: Umbrella;
    }[];
  }) => {
    eventsNeededCount = response.bundle.componentIds.length;
    response.permissions.forEach((permission) => {
      if (!productsEventReceived[permission?.component['code']])
        productsEventReceived[permission?.component['code']] = false;
    });
  };

  const resetEdulogActivationEventsTracker = () => {
    productsEventReceived = {};
    eventsReceivedCount = 0;
    eventsNeededCount = 0;
  };
  //checks if all events are received
  const areAllEdulogActivationEventsReceived = () => {
    if (
      eventsReceivedCount == eventsNeededCount &&
      Object.keys(productsEventReceived).every(
        (key) => productsEventReceived[key]
      )
    ) {
      return true;
    }
    return false;
  };

  //checks if the product event is received
  const _isComponentActivationEventReceived = (eventBody: any) =>
    // in some products the product code is in lowercase and in some it is in camel case
    productsEventReceived[eventBody.productcode || eventBody.productCode];

  //increases events received count by 1 every time an event is received and sets the product event received to true
  const _onActivationEventReceive = (eventBody: any) => {
    eventsReceivedCount++;
    // in some products the product code is in lowercase and in some it is in camel case
    productsEventReceived[eventBody.productcode || eventBody.productCode] =
      true;
  };

  //checks if the event is relevant to the activation for the Edulog user
  const _isRelevantEvent = (eventBody: any, id: string) => {
    return (
      eventBody &&
      (eventBody.action == 'USER_ENTITLEMENT_ADD' ||
        eventBody.action == 'USER_ENTITLEMENT_UPDATE') &&
      eventBody.category == 'PRODUCT' &&
      eventBody.ext_user_id == id &&
      eventBody.spacekey == 'user_' + id
    );
  };

  return {
    resetEdulogActivationEventsTracker,
    updateEventTrackingOnEdulogActivationResponse,
    areAllEdulogActivationEventsReceived,
    listenForEdulogActivationEvents
  };
}
