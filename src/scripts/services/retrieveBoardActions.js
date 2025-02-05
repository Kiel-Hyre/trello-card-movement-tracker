import axios from 'axios';
import config from "../config.js";

const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config


export const retrieveBoardActionsAPI = async (boardId, page, filters, startDateTime, endDateTime) => {
  const url = `${BASE_URL}/boards/${boardId}/actions`;
  const params = {
    filter: filters.join(','),
    limit: 1000,
    page,
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN
  };

  // Only include 'since' if we have a valid startDateTime
  if (startDateTime && startDateTime > new Date(0)) {
    params.since = new Date(startDateTime).toISOString();
  }

  // Only include 'before' if endDateTime is provided
  if (endDateTime) {
    params.before = new Date(endDateTime).toISOString();
  }

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.log(error)
    console.error(`Error fetching board actions: ${error}`);
    return [];
  }
};

export const retrieveBoardActions = async (boardId, page = 0, startDateTime = null, endDateTime = null) => {
  let history = [];
  let moveQueue = {};
  const filters = ["moveCardToBoard", "updateCard", "moveCardFromBoard", "createCard"];

  for (let i = page; i < 1; i++) {
    let actions = await retrieveBoardActionsAPI(boardId, i , filters, startDateTime, endDateTime);

    for (let action of actions) {
      if (action.type === "moveCardFromBoard") {
        moveQueue[action.data.card.id] = action; // Store fromBoard actions by card ID
      }

      if (action.type === "moveCardToBoard") {
        if (moveQueue[action.data.card.id]) {
          moveQueue[action.data.card.id].toBoard = action; // Match with fromBoard
          history.push(moveQueue[action.data.card.id]); // Store complete move action
          delete moveQueue[action.data.card.id]; // Remove from queue
        } else {
          history.push(action); // If no matching fromBoard, store it separately
        }
      }

      if (["createCard"].includes(action.type)) {
        history.push(action);
      }

      if (action.type === "updateCard") {
        const { listBefore, listAfter } = action.data;

        if (listBefore && listAfter) {
          history.push(action);
        }
      }
    }
  }

  return history;
};