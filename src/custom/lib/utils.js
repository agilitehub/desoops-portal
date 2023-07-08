/**
 * Copies the provided text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise} A promise that resolves when the text has been successfully copied, or rejects when an error occurs or the Clipboard API is not supported.
 */
export const copyTextToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    // Check if the text is a string and not empty.
    if (typeof text !== 'string' || text.trim() === '') {
      reject(new Error('Invalid text: Text should be a non-empty string.'))
      return
    }

    // Check if the Clipboard API is supported.
    if (!navigator.clipboard) {
      reject(new Error('Clipboard API not supported'))
      return
    }

    // Try to write the text to the clipboard.
    navigator.clipboard
      .writeText(text)
      .then(resolve) // If successful, resolve the promise.
      .catch(reject) // If an error occurs, reject the promise with the error.
  })
}
