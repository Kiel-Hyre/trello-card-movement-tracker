import axios from 'axios';
import config from "../config.js";

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config



export const retrieveCardActionV2 = async (cardId, page = 19, filter = 'all', startDateTime = null, endDateTime = null) => {

  const params = {
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN,
    filter,
    since: startDateTime,
    before: endDateTime,
    page
  }
  
  try {
    // Fetch actions related to card movement
    const actionsResponse = await axios.get(`${BASE_URL}/cards/${cardId}/actions`, { params })
    let actions = actionsResponse.data.reverse()
    return actions
  } catch (error) {
    // console.error('Error fetching card action data:', error.response?.data || error.message)
    throw error
  }
}


export default async (cardId) => { 
  try {
    const actionsResponse = await axios.get(`${BASE_URL}/cards/${cardId}/actions`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
        filter: 'updateCard:idList', // Filter for list movement events
      },
    });
    return actionsResponse.data;
  } catch (error) {
    console.error('Error fetching board data:', error.response?.data || error.message);
    throw error
  }
}