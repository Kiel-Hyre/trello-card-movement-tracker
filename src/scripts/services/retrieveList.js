import axios from 'axios'
import config from "../config.js"



const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


export const retrieveListDetail = async (listId) => {

  const params = {
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN,
  }

  try {
    const response = await axios.get(`${BASE_URL}/lists/${listId}`, { params })
    return response.data

  } catch (error) {
    // console.error('Error fetching list data:', error.response?.data || error.message)
    throw error
  }

}