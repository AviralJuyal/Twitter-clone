export const useNotification = () => {
  // instance of Notification Library
  let notificationLib: any;

  const loadNotifications = () => {
    if (
      window &&
      // @ts-ignore
      typeof window['NotificationLib'] !== 'undefined' &&
      // @ts-ignore
      window['NotificationLib']
    ) {
      initialiseNotificationComponent();
    } else {
      //Listen to notification custom event
      const handler = () => {
        initialiseNotificationComponent();
        window.removeEventListener(
          'cambridgeOne.notificationComponentLoaded',
          handler
        );
      };
      window.addEventListener(
        'cambridgeOne.notificationComponentLoaded',
        handler
      );
    }
  };

  const initialiseNotificationComponent = () => {
    setTimeout(() => {
      getNotificationInstance();
      notificationLib.init('notificationContainer');
    }, 0);
  };

  const getNotificationInstance = () => {
    if (!notificationLib) {
      // @ts-ignore
      notificationLib = new window['NotificationLib'].NotificationComponent();
    }
  };

  return {
    loadNotifications
  };
};
