/**
 * Util function to help with file downloading.
 */

/**
 * Download a file by creating a temporary hidden anchor element
 * - The temporary anchor element is clicked automatically and then removed from the page.
 * @param url - The url of the file to download
 * @param filename - Optional, the name of the file to download
 */
export const downloadFile = (url: string, filename?: string) => {
  const tempAnchor = document.createElement('a');
  tempAnchor.setAttribute('download', filename ?? '');
  tempAnchor.setAttribute('hidden', 'true');
  tempAnchor.classList.add('hidden', 'd-none');
  tempAnchor.setAttribute('href', url);
  document.body.appendChild(tempAnchor);
  tempAnchor.click();
  document.body.removeChild(tempAnchor);
};
