/**
 * Util functions for date and time conversion.
 */

/**
 * Converts epoch timestamp to formatted date string.
 *
 * @param {number} epoch - Epoch timestamp to be converted.
 * @param {string} locale - Locale for the formatted date string. Defaults to 'En'.
 * @returns {string} Formatted date string ["May 29, 2024"]. If no epoch is provided, returns an empty string.
 */
export const epochToDate = (epoch?: number, locale = 'En') => {
  if (!epoch) return '';
  const date = new Date(epoch);

  let dateLocale = 'en-US';
  if (locale && locale === 'Es') {
    dateLocale = 'es-ES';
  }

  return date.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Converts epoch timestamp to formatted time string.
 *
 * @param {number} epoch - Epoch timestamp to be converted.
 * @returns {string} Formatted time string in 24-hour format ["23:02"]. If no epoch is provided, returns an empty string.
 */
export const epochToTime = (epoch?: number) => {
  if (!epoch) return '';
  const date = new Date(epoch);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
