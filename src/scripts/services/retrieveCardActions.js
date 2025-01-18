import axios from 'axios';
import config from "../config.js";

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


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
