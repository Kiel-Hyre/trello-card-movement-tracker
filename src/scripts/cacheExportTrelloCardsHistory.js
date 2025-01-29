import fs from 'fs';
import path from 'path';

import retrieveCards from './services/retrieveCards.js';
import retrieveBoards from './services/retrieveBoards.js';
import { retrieveHistory, parseHistory, parseHistoryCSV } from './services/retrieveCardHistory.js';


const CACHE_DIR = path.join('src', 'tmp');
const CACHE_TIMELOG_FILE = path.join(CACHE_DIR, 'cache_timelog.txt');
const CACHE_MOVEMENT_FILENAME = 'cache_card_movements.csv'
const CACHE_MOVEMENTS_FILE = path.join(CACHE_DIR, CACHE_MOVEMENT_FILENAME);


const cacheExportTrelloCardsHistory = async () => {

  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const now = new Date();
  let isUpdated = false;

  let cachedTime = now

  if (fs.existsSync(CACHE_TIMELOG_FILE)) {

    const cachedTimelog = fs.readFileSync(CACHE_TIMELOG_FILE, 'utf-8');
    cachedTime = new Date(cachedTimelog);

    if (cachedTime >= now) {
      isUpdated = true;
    }
    
  } else {
    console.log('Timelog file not found. Creating a new one with the current timestamp.');
    fs.writeFileSync(CACHE_TIMELOG_FILE, now.toISOString(), 'utf-8');
  }

  if (isUpdated) {
    console.log(`Cache is up to date. Using cached data from ${CACHE_MOVEMENTS_FILE}`);
    return true;

  } else {
    console.log('Cached log is outdated. Fetching new data.');
  }

  // update the timelog
  fs.writeFileSync(CACHE_TIMELOG_FILE, now.toISOString(), 'utf-8');

  let boards = null
  let cards = null
  let histories = []

  // if no movement file exist fetch the latest
  if (!fs.existsSync(CACHE_MOVEMENTS_FILE)) {

    boards = await retrieveBoards()

    for (const board of boards) {

      console.log(`Board ${board.id} - ${board.name}`)

      cards = await retrieveCards(board.id);

      for (const card of cards) {
        console.log("Get Card History ", card.id, "-", card.name)
        let history = await retrieveHistory(card)
        histories.push(...history)
      }
    }
    let filePath = await parseHistoryCSV(histories, CACHE_MOVEMENT_FILENAME)
    console.log(`Export Complete view at ${filePath}`)
    return true
  }

  // get from cacheTime as start

  boards = await retrieveBoards()

  for (const board of boards) {

    console.log(`Board ${board.id} - ${board.name}`)
    cards = await retrieveCards(board.id);
    for (const card of cards) {
      console.log("Get Card History ", card.id, "-", card.name)
      let history = await retrieveHistory(card, 19, 'all', cachedTime, null)
      histories.push(...history)
    }
  }
  const newMovements = await parseHistory(histories, false, true);

  if (newMovements.length > 0) {
    const csvRows = newMovements
      .map(movement => `${movement.card_id},${movement.card_name},${movement.from_board_id},${movement.from_board_name},${movement.from_list_id},${movement.from_list_name},${movement.to_board_id},${movement.to_board_name},${movement.to_list_id},${movement.to_list_name},${movement.timestamp},${movement.remarks}`)
      .join('\n');

    fs.appendFileSync(CACHE_MOVEMENTS_FILE, csvRows + '\n', 'utf-8');
    console.log(`Added ${newMovements.length} new rows to ${CACHE_MOVEMENTS_FILE}`);
  } else {
    console.log(`No movement`)
  }

};


// Get board ID from command-line arguments or exit if not provided
// const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

// if (!boardId) {
//   console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
//   process.exit(1);
// }

// Run the script
cacheExportTrelloCardsHistory();
