export function useClassInvitation() {
  /**
   * Listen to the join class via invitation event.
   * If the intended event is received then emit the
   * user:join-class-via-invitation-process-complete event
   */
  const listenForJoinClassViaInvitationEvent = (
    id: string,
    pushConnection: any,
    payload:
      | {
          role: 'teacher';
          schoolId: string;
          serverPushConnectionId: string;
        }
      | {
          role: 'student';
          serverPushConnectionId: string;
        }
  ) => {
    const { $event } = useNuxtApp();
    let channelObject: any;
    if (payload.role === 'student') {
      channelObject = {
        accountid: useRuntimeConfig().public.dlsAccountId,
        channel: 'refid.' + id
      };
    } else {
      channelObject = {
        userid: payload.serverPushConnectionId,
        orgid: payload.schoolId,
        channel: 'systemevents.CLASS.USER_ENROLLMENT_ADD'
      };
    }
    pushConnection.on(channelObject, (eventContext: any) => {
      const eventBody = eventContext?.events?.body;
      if (
        eventBody &&
        (eventBody.ext_user_id === payload.serverPushConnectionId ||
          eventBody.actorid === payload.serverPushConnectionId)
      ) {
        $event('user:join-class-via-invitation-process-complete', {
          userId: id,
          status: eventBody.status,
          body: eventBody
        });
      }
    });
  };

  /**
   * Listen to the create school for private learner event.
   * if the intended event is received then emit the
   * user:create-school-for-private-learner-process-complete event
   */
  const listenForCreateSchoolForPrivateLearnerEvent = (
    id: string,
    pushConnection: any
  ) => {
    const { $event } = useNuxtApp();

    pushConnection.on(
      {
        accountid: useRuntimeConfig().public.dlsAccountId,
        channel: 'refid.' + id
      },
      (eventContext: any) => {
        const eventBody = eventContext?.events?.body;
        if (
          eventBody &&
          eventBody.action == 'CREATE' &&
          eventBody.category == 'USER' &&
          eventBody.ext_user_id == id
        ) {
          if (eventBody.status == 'success') {
            $event('user:create-school-for-private-learner-process-complete', {
              userId: id,
              status: 'success',
              body: eventBody
            });
          } else if (eventBody.status == 'error') {
            $event('user:create-school-for-private-learner-process-complete', {
              userId: id,
              status: 'failure',
              body: eventBody
            });
          }
        }
      }
    );
  };

  return {
    listenForJoinClassViaInvitationEvent,
    listenForCreateSchoolForPrivateLearnerEvent
  };
}
