import Enums from './enums'

/**
 * Copies the provided text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise} A promise that resolves when the text has been successfully copied, or rejects when an error occurs or the Clipboard API is not supported.
 */
export const copyTextToClipboard = async (text) => {
  let error = null

  try {
    // If text is a number, then convert to a string
    if (typeof text === 'number') text = text.toString()

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

export const calculateDaysSinceLastActive = (lastTransactionTimestamp) => {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const lastActiveDate = new Date(lastTransactionTimestamp)
  const now = new Date()
  const diffDays = Math.round(Math.abs((now - lastActiveDate) / oneDay))
  return diffDays
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

// Create a function that sorts an array of objects by a key value
export const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    const x = a[key]
    const y = b[key]

    return x < y ? -1 : x > y ? 1 : 0
  })
}

// Create a function that builds the GQL props based on the setup and rules provided
export const buildGQLProps = async (distributeTo, publickKey, desoData) => {
  const gqlProps = {}

  try {
    // Determine Distribute To
    switch (distributeTo) {
      case Enums.values.DAO:
      case Enums.values.CREATOR:
        gqlProps.publicKey = publickKey
        gqlProps.orderBy = 'BALANCE_NANOS_DESC'

        gqlProps.condition = {
          isDaoCoin: distributeTo === Enums.values.DAO
        }

        break
    }

    return gqlProps
  } catch (e) {
    console.error(e)
    return e
  }
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

// const _determineGQLFilterAmount = (gqlProps, filterAmount, filterAmountIs, isDAO) => {
//   let tokenBalance = null

//   if (filterAmount) {
//     gqlProps.filter.balanceNanos = {}
//     tokenBalance = filterAmount * Enums.values.NANO_VALUE
//     if (isDAO) tokenBalance = tokenBalance * Enums.values.NANO_VALUE

//     switch (filterAmountIs) {
//       case '>':
//         gqlProps.filter.balanceNanos.greaterThan = tokenBalance
//         break
//       case '<':
//         gqlProps.filter.balanceNanos.lessThan = tokenBalance
//         break
//       case '>=':
//         gqlProps.filter.balanceNanos.greaterThanOrEqualTo = tokenBalance
//         break
//       case '<=':
//         gqlProps.filter.balanceNanos.lessThanOrEqualTo = tokenBalance
//         break
//     }
//   }
// }

// const _determineGQLReturnAmount = (gqlProps, returnAmount) => {
//   if (returnAmount) {
//     gqlProps.first = returnAmount
//   }
// }

// const _determineGQLLactActiveDays = (gqlProps, lastActiveDays) => {
//   // Using the current date, use the lastActiveDays to determine the timestamp to pass to GQL
//   // Timestamp to be in the following format: "yyyy-mm-dd"
//   let timestamp = new Date()
//   timestamp.setDate(timestamp.getDate() - lastActiveDays)
//   timestamp = timestamp.toISOString().split('T')[0]

//   if (lastActiveDays) {
//     gqlProps.filter.holder = {
//       transactionStats: {
//         latestTransactionTimestamp: {
//           greaterThanOrEqualTo: timestamp
//         }
//       }
//     }
//   }
// }
