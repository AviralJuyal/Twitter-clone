export function useJoinClass() {
  /**
   * Listen to the join class event
   * if the intended event is received then emit the learner:join-class-process-complete event
   */
  const listenForJoinClassAsLearnerEvent = (
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
        // Check if the event is the required event
        if (
          !eventBody ||
          eventBody.ext_user_id !== id ||
          eventBody.category !== 'CLASS' ||
          eventBody.action !== 'USER_ENROLLMENT_ADD'
        ) {
          // If not, do nothing
          return;
        }

        // Emit the learner:join-class-process-complete event
        $event('learner:join-class-process-complete', {
          userId: id,
          status: eventBody.status === 'success' ? 'success' : 'failure',
          body: eventBody,
          classId: eventBody.classid,
          schoolId: eventBody.schoolid
        });
      }
    );
  };

  return {
    listenForJoinClassAsLearnerEvent
  };
}
