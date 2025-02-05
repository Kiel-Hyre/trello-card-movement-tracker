
import axios from 'axios'
import path from 'path';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

import config from "../config.js"
import { retrieveListDetail } from './retrieveList.js'
import { retrieveCardActionV2 } from './retrieveCardActions.js';


export const retrieveHistory = async (card, page = 19, filter = 'all', startDateTime = null, endDateTime = null) => {

  const { id: cardId } = card

  let history = []

 
  for (let i = page; i >= 0; i--){

    let actions = await retrieveCardActionV2(cardId, i, filter, startDateTime, endDateTime)

    for (let y = 0; y < actions.length; y++) {

      if (actions[y].type === "moveCardToBoard") {
        // push it on the previous
        actions[y - 1].toBoard = actions[y]
      }

      if (["moveCardFromBoard", "createCard"].includes(actions[y].type)) {
        history.push(actions[y])
      }

      if (actions[y].type === "updateCard") {
        const listBefore = actions[y].data.listBefore
        const listAfter = actions[y].data.listAfter

        if (!listBefore || !listAfter) {
          continue
        }
        history.push(actions[y])
      } 
    }
  }
  return history
}


export const parseHistory = async (history, printed = true, returnAsArray = false) => {

  history.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  let movements = []

  for (const action of history) {
    let event = ""
    let card = { id: null, name: null }
    let fromBoard = { id: null, name: null }
    let fromList = { id: null, name: null }
    let toBoard = { id: null, name: null }
    let toList = { id: null, name: null }
    let timeStamp = null

    switch (action.type) {

      case 'createCard':

        event = 'Created Card'
        card = action.data.card
        fromBoard = action.data.board
        fromList = await retrieveListDetail(action.data.list.id)
        timeStamp = action.date
        break

      case 'moveCardFromBoard':
        event = 'Move Card Board'
        card = action.data.card
        fromBoard = action.data.board
        fromList = action.data.list
        toBoard = action.toBoard.data.board || null
        toList = action.toBoard.data.list || null
        timeStamp = action.date
        break

      case 'updateCard':

        event = 'Update Card'
        card = action.data.card
        fromBoard = action.data.board
        fromList = action.data.listBefore
        toBoard = action.data.board
        toList = action.data.listAfter
        timeStamp = action.date
        break

      default:
        continue
    }

    if (printed) {
      console.log(
        `\n${event} \n`
        + `Card ${card.id} - ${card.name} \n`
        + `From Board ${fromBoard.id} - ${fromBoard.name} \n`
        + `List ${fromList.id} - ${fromList.name} \n`
        + `To Board ${toBoard.id} - ${toBoard.name} \n`
        + `List ${toList.id} - ${toList.name} \n`
        + `At ${timeStamp} \n`
      );
    }

    if (returnAsArray) {
      movements.push(
        {
          card_id: card.id,
          card_name: card.name,
          from_board_id: fromBoard.id,
          from_board_name: fromBoard.name,
          from_list_id: fromList.id,
          from_list_name: fromList.name,
          to_board_id: toBoard.id,
          to_board_name: toBoard.name,
          to_list_id: toList.id,
          to_list_name: toList.name,
          timestamp: timeStamp,
          remarks: event
        }
      )
    }
  }

  if (returnAsArray) { return movements }
  return true
}


export const parseHistoryCSV = async (history, filename = 'card_movements.csv') => { 

  const filePath = path.join('src', 'tmp', filename);
  
  // Ensure the directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  // CSV Writer setup
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
    
      { id: 'card_id', title: 'Card Id' },
      { id: 'card_name', title: 'Card Name' },
      { id: 'from_board_id', title: 'From Board Id' },
      { id: 'from_board_name', title: 'From Board Name' },

      { id: 'from_list_id', title: 'From List Id' },
      { id: 'from_list_name', title: 'From List Name' },
      
      { id: 'to_board_id', title: 'To Board Id' },
      { id: 'to_board_name', title: 'To Board Name' },

      { id: 'to_list_id', title: 'To List Id' },
      { id: 'to_list_name', title: 'To List Name' },

      { id: 'timestamp', title: 'Timestamp' },
      { id: 'remarks', title: 'Remarks' }
      
    ],
  });

  let movements = await parseHistory(history, false, true)
  await csvWriter.writeRecords(movements);
  return filePath

}



export const parseHistorySheets = async (history) => { 

  let movements = await parseHistory(history, false, true)
  
  try {

    const url = config.APPSCRIPT_API;

    const payload = {
      items: movements,
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.message;
  } catch (error) {

    console.error('Error posting to Google Apps Script:', error.message);
    throw error;
  }

}