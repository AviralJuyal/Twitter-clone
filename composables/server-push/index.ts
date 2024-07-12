/**
 * SERVER PUSH Composable
 * (implented using DLS PushX service)
 *
 * This composable is used to handle server push events.
 * It supports multiple workflows: see `.\worflows\`.
 *
 * Typical usage:
 *
 * const push = useServerPush();
 * const PushEventSubscription: AsyncWorkflowType
 *
 * //Step 1. Open connection
 * await serverPush.openConnection(refid, PushEventSubscription)
 *
 * //Step 2. Call Domain service for initiating async workflow
 * // Start showing the loader
 *
 * //Step 3. Subscribe to the workflow push event
 * $listen('user:activation-processing-complete', handler (event) => {
 *   //Stop showing the loader
 *  push.closeConnection();
 *  });
 *
 * Note: use $removeListener to remove the listener in the component onbeforeUnmount
 * $removeListen('user:activation-processing-complete', handler)
 */
import ComproDLS from 'comprodls-sdk';

export function useServerPush() {
  /**
   * Get the Global EVENT BUS.
   *
   * We will the event bus to emit events when the
   * async workflow is completed.
   *
   */
  const { $event } = useNuxtApp();

  const {
    listenForActivationEvents,
    resetActivationEventsTracker,
    updateEventTrackingOnActivationResponse,
    areAllActivationEventsReceived
  } = useActivationByCode();

  const {
    areAllEdulogActivationEventsReceived,
    resetEdulogActivationEventsTracker,
    listenForEdulogActivationEvents,
    updateEventTrackingOnEdulogActivationResponse
  } = useActivationForEdulog();

  interface AsyncWorkflow {
    type: AsyncWorkflowType;
    payload?: any;
  }
  enum AsyncWorkflowType {
    ACTIVATION_BY_CODE = 'activation_by_code',
    JOIN_CLASS_AS_LEARNER = 'join_class_as_learner',
    ADD_MATERIALS_TO_CLASS = 'add_materials_to_class',
    CLONE_A_CLASS = 'clone_a_class',
    ACTIVATION_FOR_EDULOG = 'activation_for_edulog',
    JOIN_CLASS_VIA_INVITATION = 'join-class-via-invitation',
    CREATE_SCHOOL_FOR_PRIVATE_LEARNER = 'create-school-for-private-learner'
  }

  /**
   * Map of all the push connections established
   */
  const pushConnections = new Map<string, any>();

  /**
   * Establish a connection with the DLS PUSHX service
   *
   * Step 1. Get credentials from the backend, authorising
   * ourselves with the DLS PUSHX
   *
   * Step 2. Use credentials to establish a connection with
   * DLS PushX service
   *
   * Step 3. Subscribe to the workflow event that we are
   * interested in.
   */

  let pushx: any;
  const openConnection = async (
    id: string,
    subscription: AsyncWorkflow,
    schoolId: string | undefined = undefined // If School level connection is required
  ): Promise<void> => {
    if (!pushConnections.get(schoolId || id)) {
      // if connection is already not present
      /**
       * Step 1. Get credentials from the backend
       */
      let openConnectionResponse: any;
      // If school id is present, setup school level connection else setup account level connection
      if (schoolId) {
        openConnectionResponse = await useFetchHelper().fetch<any>(
          '/api/pushx-school',
          {
            method: 'POST',
            body: { userId: id, schoolId }
          }
        );
      } else {
        openConnectionResponse = await useFetchHelper().fetch<any>(
          '/api/pushx-account',
          {
            method: 'POST',
            body: { refId: id }
          }
        );
      }
      /**
       * Step 2. Establish a connection with
       * DLS PushX service
       */
      //Initialise the ComproDLS SDK
      const comproDLS = ComproDLS.init(
        useRuntimeConfig().public.dlsEnv,
        useRuntimeConfig().public.dlsRealm
      );
      pushx = comproDLS.PushX();

      //Save the connection credentials reference in the map
      if (schoolId) {
        pushConnections.set(schoolId, {
          credential: openConnectionResponse.data.value,
          subscription: subscription
        });
      } else {
        pushConnections.set(id, {
          credential: openConnectionResponse.data.value,
          subscription: subscription
        });
      }
    }
    //Start connecting (asynchronously)
    const pushConnection = pushConnections.get(schoolId || id);
    pushConnection.connection = pushx.connect(pushConnection.credential);

    //Save the connection in the map for reuse in the
    if (schoolId) {
      pushConnections.set(schoolId, pushConnection);
    } else {
      pushConnections.set(id, pushConnection);
    }

    /**
     * Step 3. Subscribe for the workflow event
     */
    _subscribeToWorkflow(id, subscription, schoolId);

    /**
     * Wait for connection to be established successfully
     *
     */
    return new Promise((resolve, reject) => {
      pushConnections
        .get(schoolId || id)
        .connection.on({ channel: 'pushx_status' }, (connectionStatus: any) => {
          /**
           * Check if the PushX connection was successful
           *  - If successful, resolve the promise
           *  - If error, reject the promise
           */
          if (
            connectionStatus.category === 'PUSHX' &&
            connectionStatus.type === 'CHANNEL_SUBSCRIPTION'
          ) {
            if (connectionStatus.status === 'SUCCESS') {
              resolve();
            } else if (connectionStatus.status === 'ERROR') {
              reject(
                'PUSH_SUBSCRIPTION_ERROR' + JSON.stringify(connectionStatus)
              );
            }
          }
        });
    });
  };
  /**
   * clean pushX
   */
  const cleanup = () => {
    if (pushx) {
      pushx.cleanup();
    }
  };
  /**
   * Remove the push connection and also cleans up other areas specific to subscription types
   * @param id
   */
  const closeConnection = (id: string, schoolId?: string) => {
    if (!pushConnections.get(schoolId || id)) {
      throw new Error(
        'No push connection found. Open the connection before using this function'
      );
    }
    const subscription = pushConnections.get(schoolId || id).subscription;
    if (
      subscription &&
      subscription.type == AsyncWorkflowType.ACTIVATION_BY_CODE
    ) {
      resetActivationEventsTracker();
    } else if (
      subscription &&
      subscription.type == AsyncWorkflowType.ACTIVATION_FOR_EDULOG
    ) {
      resetEdulogActivationEventsTracker();
    }
    pushConnections.delete(schoolId || id);
  };

  /**
   * Function to be used for updating more information
   * to the workflow subscription.
   *
   * This function can be called optionally, based on the
   * reponse of the domain service
   *
   * For example activation code workflow events are tracked
   * for each components individually. The component codes
   * are known from the domain service response.
   */
  const updateSubscription = async (
    id: string,
    subscription: AsyncWorkflow
  ) => {
    if (!pushConnections.get(id).subscription) {
      throw new Error(
        'No subscription found. Open the connection & subscribe before using this function'
      );
    }
    if (subscription.type === AsyncWorkflowType.ACTIVATION_BY_CODE) {
      pushConnections.set(id, {
        connection: pushConnections.get(id).connection,
        credential: pushConnections.get(id).credential,
        subscription: subscription
      });

      updateEventTrackingOnActivationResponse(subscription.payload);
      if (areAllActivationEventsReceived()) {
        $event('user:activation-processing-complete', {
          userId: id,
          status: 'success'
        });
      }
    } else if (subscription.type === AsyncWorkflowType.ACTIVATION_FOR_EDULOG) {
      pushConnections.set(id, {
        connection: pushConnections.get(id).connection,
        subscription: subscription
      });

      updateEventTrackingOnEdulogActivationResponse(subscription.payload);
      if (areAllEdulogActivationEventsReceived()) {
        $event('user:activation-processing-complete', {
          userId: id,
          status: 'success'
        });
      }
    }
  };

  /**
   * Subcribe to one of the asynchronous workfloes
   * @param id - typically user id
   * @param subscription - to specify the workflow type
   * @param callback - callback method to be executed on event receive
   * The method listens to the success/error events received once pushx connection is created. If the status is sucess, it will check in the callback if all the components were successfully activated and if yes, it will navigate to success page.
   */
  const _subscribeToWorkflow = (
    id: string,
    subscription: AsyncWorkflow,
    schoolId?: string
  ) => {
    if (!pushConnections.get(schoolId || id)) {
      throw new Error(
        'No push connection found. Open the connection before using this function'
      );
    }
    if (subscription.type === AsyncWorkflowType.ACTIVATION_BY_CODE) {
      listenForActivationEvents(id, pushConnections.get(id).connection);
    } else if (subscription.type === AsyncWorkflowType.ACTIVATION_FOR_EDULOG) {
      listenForEdulogActivationEvents(id, pushConnections.get(id).connection);
    } else if (subscription.type === AsyncWorkflowType.JOIN_CLASS_AS_LEARNER) {
      useJoinClass().listenForJoinClassAsLearnerEvent(
        id,
        pushConnections.get(id).connection
      );
    } else if (
      subscription.type === AsyncWorkflowType.JOIN_CLASS_VIA_INVITATION
    ) {
      if (subscription.payload.role === 'student') {
        useClassInvitation().listenForJoinClassViaInvitationEvent(
          id,
          pushConnections.get(schoolId || id).connection,
          {
            role: 'student',
            serverPushConnectionId: subscription.payload.serverPushConnectionId
          }
        );
      } else {
        useClassInvitation().listenForJoinClassViaInvitationEvent(
          id,
          pushConnections.get(schoolId || id).connection,
          {
            role: 'teacher',
            schoolId: subscription.payload.schoolId,
            serverPushConnectionId: subscription.payload.serverPushConnectionId
          }
        );
      }
    } else if (
      subscription.type === AsyncWorkflowType.CREATE_SCHOOL_FOR_PRIVATE_LEARNER
    ) {
      useClassInvitation().listenForCreateSchoolForPrivateLearnerEvent(
        id,
        pushConnections.get(id).connection
      );
    } else if (subscription.type === AsyncWorkflowType.ADD_MATERIALS_TO_CLASS) {
      // listen for add metrials to class events
    }
  };

  return {
    openConnection,
    updateSubscription,
    closeConnection,
    cleanup,
    AsyncWorkflowType
  };
}
