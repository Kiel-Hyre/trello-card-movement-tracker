import axios from 'axios';
import config from "../config.js";
import retrieveBoards from './retrieveBoards.js';

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


export const retrieveCardsV2 = async (boardId) => {
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


export const getCardDetails = async (cardId) => {
  const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config;
  const params = { key: TRELLO_API_KEY, token: TRELLO_TOKEN, fields: 'name,idList,labels,dateLastActivity,closed' };

  try {
    const response = await axios.get(`${BASE_URL}/cards/${cardId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching card details: ${cardId} ${error.message}`);
    return null;
  }
};


export const getCardsFromAllBoards = async () => {
  const boards = await retrieveBoards();
  let allCards = [];

  for (const board of boards) {
    const cards = await retrieveCardsV2(board.id)
    allCards.push(...cards)
  }
  return allCards;
};


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
