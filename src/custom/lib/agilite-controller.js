// Logic in this file will interact with the Agilit-e API.
// As a start, we will be executing the Templates Agilite API...
// which will bring down the App configurations in JSON format.
import Agilite from 'agilite'

let agilite = null

// Create a function that initiates the Agilit-e API
export const initAgilite = () => {
  agilite = new Agilite({
    apiServerUrl: process.env.REACT_APP_AGILITE_API_URL,
    apiKey: process.env.REACT_APP_AGILITE_API_KEY
  })
}

// Create a function that retrieves the App configurations from Agilit-e
export const getAgiliteData = async () => {
  try {
    const response = await agilite.Templates.execute('deso_ops_portal_config')
    return response.data
  } catch (e) {
    throw e
  }
}
