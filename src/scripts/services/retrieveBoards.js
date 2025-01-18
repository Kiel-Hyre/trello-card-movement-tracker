import axios from "axios";
import config from "../config.js";

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


export default async () => {
  try {
    const response = await axios.get(`${BASE_URL}/members/me/boards`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });
    const boards = response.data;
    return boards
  } catch (error) {
    console.error('Error fetching Trello boards:', error.response?.data || error.message);
    throw error
  }
}