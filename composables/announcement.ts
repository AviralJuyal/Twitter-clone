export const useAnnouncement = () => {
  // instance of Announcement Library
  let announcementLib: any;

  const loadAnnouncements = () => {
    if (
      window &&
      // @ts-ignore
      typeof window['AnnouncementLib'] !== 'undefined' &&
      // @ts-ignore
      window['AnnouncementLib']
    ) {
      initialiseAnnouncementComponent();
    } else {
      //Listen to notification custom event
      const handler = () => {
        initialiseAnnouncementComponent();
        window.removeEventListener(
          'cambridgeOne.announcementComponentLoaded',
          handler
        );
      };
      window.addEventListener(
        'cambridgeOne.announcementComponentLoaded',
        handler
      );
    }
  };

  const initialiseAnnouncementComponent = () => {
    setTimeout(() => {
      getAnnouncementInstance();
      announcementLib.initAnnoucement('announcementNotificationContainer');
    }, 0);
  };

  const getAnnouncementInstance = () => {
    if (!announcementLib) {
      // @ts-ignore
      announcementLib = new window['AnnouncementLib'].AnnouncementComponent();
      console.log(announcementLib);
    }
  };

  /**
   * Get Service ANnouncement List
   *
   * Service announcement list is required  at different places to handle other banners
   * - Desktopapp banner - is shown only when there is no service announcement
   * - Teacher Info Banner - has some styling changes when there is service announcement
   */
  const getAnnouncements = () => {
    return new Promise((resolve) => {
      // @ts-ignore
      if (typeof window['AnnouncementLib'] !== 'undefined') {
        fetchAnnouncements()
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            throw err;
          });
      } else {
        //Listen to notification custom event
        handleNotificationComponentLoaded(resolve);
      }
    });
  };

  /**
   * function to listen to notification custom event
   * @param resolve
   */
  const handleNotificationComponentLoaded = (
    resolve: (value: unknown) => void
  ) => {
    const handler = () => {
      // fetch announcements
      fetchAnnouncements()
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          throw err;
        });

      window.removeEventListener(
        'cambridgeOne.announcementComponentLoaded',
        handler
      );
    };

    window.addEventListener(
      'cambridgeOne.announcementComponentLoaded',
      handler
    );
  };
  /**
   *
   * @returns
   */
  const fetchAnnouncements = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        getAnnouncementInstance();
        console.log('got notification instance');
        let res;
        // @ts-ignore
        announcementLib.getAnnouncements().then((response) => {
          res = response;
          resolve(res);
        });
      }, 0);
    });
  };

  return {
    getAnnouncements,
    loadAnnouncements
  };
};
