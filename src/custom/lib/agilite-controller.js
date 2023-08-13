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
export const getConfigData = async () => {
  const response = await agilite.Templates.execute('deso_ops_portal_config')
  return response.data
}

// Create a function that creates a new Distribution Transaction in Agilit-e
export const createDistributionTransaction = async (data) => {
  const response = await agilite.Connectors.execute('distribution_transactions', 'create', {
    data: JSON.stringify(data)
  })

  return response.data
}

// Create a function that updates an existing Distribution Transaction in Agilit-e
export const updateDistributionTransaction = async (id, data) => {
  const response = await agilite.Connectors.execute('distribution_transactions', 'update_by_id', {
    id,
    data: JSON.stringify(data)
  })

  return response
}

// Fetch Distribution Templates for user
export const getDistributionTemplates = async (publicKey) => {
  let qry = { publicKey }
  const response = await agilite.Connectors.execute('distribution_templates', 'find', {
    filter: JSON.stringify(qry)
  })

  return response.data
}

export const createDistributionTemplate = async (data) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'create', {
    data: JSON.stringify(data)
  })

  return response
}

export const updateDistributionTemplate = async (id, data) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'update_by_id', {
    id,
    data: JSON.stringify(data)
  })

  return response
}
