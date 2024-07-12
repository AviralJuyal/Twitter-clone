/**
 * Util functions to interact with the overlay loader.
 *
 * The loader is a simple overlay that is shown on top of the
 * page to indicate that some action is being done.
 * It is generally used to show that the next page is
 * being loaded. Also, at the jump points from the microAPPs
 * (such as when the user moves from dashboard APP to another
 * APP such as Class, LPv1, LPv2, etc.).
 *
 * For example, the learner navigates from the dashboard to the
 * resource bank launch page (as the resource bank page requires
 * a network call to fetch the component data from the API).
 *
 *
 * This loader should be used while the APP is operating
 * in the CSR mode (that is, as a SPA), and not in the SSR mode.
 *
 * The HTML template of the loader is present in the
 * components/common/Loader.vue and it is included in the
 * application-root layout file.
 */

/**
 * Hide the overlay loader from the page
 */
export const hideOverlayLoader = () => {
  // Get the loader container div
  const loaderContainer = document.getElementById('loader-container');

  if (loaderContainer) {
    // Remove respective classes and styles on the loader container
    loaderContainer.classList.remove('overlay-loader');
    loaderContainer.style.display = 'none';
  }
};

/**
 * Show the overlay loader on the page
 */
export const showOverlayLoader = () => {
  // Get the loader container div
  const loaderContainer = document.getElementById('loader-container');

  if (loaderContainer) {
    // Add respective classes and styles on the loader container
    loaderContainer.classList.add('overlay-loader');
    loaderContainer.style.display = 'flex';
  }
};
