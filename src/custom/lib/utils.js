/**
 * Copies the provided text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise} A promise that resolves when the text has been successfully copied, or rejects when an error occurs or the Clipboard API is not supported.
 */
export const copyTextToClipboard = async (text) => {
  let error = null

  try {
    // Check if the text is a string and not empty.
    if (typeof text !== 'string' || text.trim() === '') {
      throw new Error('Invalid text: Text should be a non-empty string.')
    }

    // Check if the Clipboard API is supported.
    if (!navigator.clipboard) {
      throw new Error('The Clipboard API is supported in this browser.')
    }

    // Try to write the text to the clipboard.
    error = 'clipboard'
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    if (error === 'clipboard') {
      error = 'The Clipboard API failed due to initial permissions issues. Please try once more.'
    } else {
      error = e.message
    }

    throw new Error(error)
  }
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

/*
 * ✅ Pass a String and return x random values
 * ✅ If String, provide a separator to split String into Array first
 * ℹ️ Pass an Array and return x random values (Needs Testing)
 * ℹ️ Pass an Object and return x random values (Needs Testing)
 * ✅ Allow option for duplicates values to be returned
 * ✅ Allow option to randomize for performance, or for genuine randomness
 * ℹ️ If Array, simply return x random Array entries (Needs Testing)
 * ℹ️ If Object, loop through root prop keys and return random prop values (Needs Testing)
 * ❌ Defensive Testing (Not Started)
 */

export const randomize = (input, separator = ' ', x = 1, performance = false, duplicates = false) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let errMsg = null

      try {
        // Check the input type
        if (!Array.isArray(input)) {
          if (typeof input === 'string') {
            // Split the string into an array
            input = input.split(separator)
          } else if (typeof input === 'object') {
            // Create an array of the object's property values
            input = Object.values(input)
            // Check if it's an array. If yes, do nothing.
          } else {
            errMsg = 'Invalid input. Please provide a string or object.'
            throw new Error(errMsg)
          }
        }

        // Remove duplicate items from the array
        if (!duplicates) {
          input = await getRandomUniqueValues(input, x)
        }

        // Check the performance option
        if (performance) {
          // Use the shuffle() method to shuffle the input array
          input = await shuffle(input)
        } else {
          // Use the Math.random() method to generate random numbers
          input = input
            .map((item, index) => index)
            .sort(() => Math.random() - 0.5)
            .slice(0, x)
            .map((index) => input[index])
        }

        input = input.slice(0, x)
        resolve(input)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

// PRIVATE FUNCTIONS
const shuffle = (array) => {
  return new Promise((resolve, reject) => {
    try {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }

      resolve(array)
    } catch (e) {
      reject(e)
    }
  })
}

const getRandomUniqueValues = (array, x) => {
  return new Promise((resolve, reject) => {
    const uniqueValues = []
    const visited = new Set()

    try {
      while (uniqueValues.length < x) {
        const randomIndex = Math.floor(Math.random() * array.length)
        const value = array[randomIndex]

        if (!visited.has(value.toLowerCase())) {
          uniqueValues.push(value)
          visited.add(value.toLowerCase())
        }

        if (visited.size === array.length) {
          break
        }
      }
      resolve(uniqueValues)
    } catch (e) {
      reject(e)
    }
  })
}
