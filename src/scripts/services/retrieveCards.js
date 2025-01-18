import axios from 'axios';
import config from "../config.js";

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


// Function to fetch cards and their action history from a Trello board
export default async (boardId) => {
  try {
    // Fetch all cards from the board
    const cardsResponse = await axios.get(`${BASE_URL}/boards/${boardId}/cards`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });
    const cards = cardsResponse.data;
    return cards
  } catch (error) {
    console.error('Error fetching board data:', error.response?.data || error.message);
    throw error
  }
};
