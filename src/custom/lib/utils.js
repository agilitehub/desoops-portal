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

/**
 * Converts a hex string to an integer.
 *
 * @param {string} hex - The hex string to be converted to an integer.
 * @returns {integer} The resulting integer.
 */
export const hexToInt = (hex) => {
  return parseInt(hex, 16)
}

/**
 * Cleans the provided string by limiting the characters and removing unwanted values.
 *
 * @param {string} inputString - The string to be cleaned.
 * @param {integer} maxCharacters - The maximum number of characters allowed in the string.
 * @param {boolean} removeHashTaggs - Whether or not to remove hash tags from the string.
 * @returns {string} The cleaned string.
 */
export const cleanString = (inputString = '', maxCharacters = 0, removeHashTags = true) => {
  let cleanedString = inputString

  // Remove any words that are hash tags from the string if requested.
  if (removeHashTags) {
    cleanedString = cleanedString.replace(/(^|\s)(#[a-z\d-]+)/gi, '')
  }

  // Limit the number of characters in the string if requested and append an ellipsis...
  // ...only if the length of the string is greater than the max characters.
  if (maxCharacters > 0 && cleanedString.length > maxCharacters) {
    cleanedString = `${cleanedString.substring(0, maxCharacters)}...`
  }

  return cleanedString
}
