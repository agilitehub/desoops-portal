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

export const getOptOutTemplate = async () => {
  const response = await agilite.Templates.getData(['opt_out_template'])

  if (response.data && response.data.length > 0) {
    return response.data[0].data.data
  } else {
    return ''
  }
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

  return response.data
}

// Create a function that fetches all trasactions from Agilit-e
export const getDistributionTransactions = async () => {
  const response = await agilite.Connectors.execute('distribution_transactions', 'aggregate', {
    pipeline: JSON.stringify([
      {
        $group: {
          _id: '$publicKey',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])
  })

  return response.data
}

// Fetch Distribution Templates for user
export const getDistributionTemplates = async (publicKey) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'find', {
    filter: JSON.stringify({ publicKey })
  })

  response.data.sort((a, b) => (a.name > b.name ? 1 : -1))

  // Add a key property to each template using _id
  response.data = response.data.map((template) => {
    return {
      ...template,
      key: template._id
    }
  })

  return response.data
}

export const createDistributionTemplate = async (data) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'create', {
    data: JSON.stringify(data)
  })

  return response.data
}

export const updateDistributionTemplate = async (id, data) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'update_by_id', {
    id,
    data: JSON.stringify(data)
  })

  return response.data
}

export const deleteDistributionTemplate = async (id) => {
  const response = await agilite.Connectors.execute('distribution_templates', 'find_id_delete', {
    id
  })

  return response.data
}

export const getOptOutProfile = async (qry) => {
  const response = await agilite.Connectors.execute('opt_out_profiles', 'find_one', {
    qry: JSON.stringify(qry)
  })

  return response.data
}

export const createOptOutProfile = async (data) => {
  const response = await agilite.Connectors.execute('opt_out_profiles', 'create', {
    data: JSON.stringify(data)
  })

  return response.data
}

export const updateOptOutProfile = async (id, data) => {
  const response = await agilite.Connectors.execute('opt_out_profiles', 'update_by_id', {
    id,
    data: JSON.stringify(data)
  })

  return response.data
}
