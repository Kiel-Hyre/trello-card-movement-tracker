import fs from 'fs';
import path from 'path';
import { retrieveBoardActions } from './services/retrieveBoardActions.js';
import retrieveBoards from './services/retrieveBoards.js';
import { parseHistory } from './services/retrieveCardHistory.js';

const CACHE_DIR = path.join('src', 'tmp');
const CACHE_MOVEMENT_FILENAME = 'cache_card_movements.csv';
const CACHE_MOVEMENTS_FILE = path.join(CACHE_DIR, CACHE_MOVEMENT_FILENAME);
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const retrieveBoardCardsHistory = async (boards, cachedTime) => {
  let histories = [];

  for (const board of boards) {
    console.log(`Fetching actions for board: ${board.id} - ${board.name}`);
    let history = await retrieveBoardActions(
      board.id,
      0,
      new Date(cachedTime),
      null
    );
    
    if (history.length > 0) {
      history.forEach(action => {
        console.log(`Loaded action for card: ${action.data.card?.name || 'Unknown Card'}`);
      });
    } else {
      console.log(`No actions found for board: ${board.name}`);
    }
    
    histories.push(...history);
  }
  
  return histories;
};

const cacheExportTrelloCardsHistory = async () => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const now = Date.now();
  let cachedTime = null;

  if (fs.existsSync(CACHE_MOVEMENTS_FILE)) {
    const stats = fs.statSync(CACHE_MOVEMENTS_FILE);
    cachedTime = stats.mtimeMs;
    
    console.log(`Last modified time of cache: ${new Date(cachedTime).toISOString()}`);
    console.log(`Current time: ${new Date(now).toISOString()}`);
    
    if (now - cachedTime < CACHE_EXPIRATION_MS) {
      console.log(`Cache is up to date (less than 24 hours old). Using cached data from ${CACHE_MOVEMENTS_FILE}`);
      return true;
    }
  }

  console.log('Cached data is outdated. Fetching new data.');

  let boards = await retrieveBoards();
  let histories = await retrieveBoardCardsHistory(boards, cachedTime);
  
  if (histories.length === 0) {
    console.log(`No new cards found.`);
  }
  
  const newMovements = await parseHistory(histories, true, true);

  if (newMovements.length > 0) {
    const csvRows = newMovements
      .map(movement => `${movement.card_id},${movement.card_name},${movement.from_board_id},${movement.from_board_name},${movement.from_list_id},${movement.from_list_name},${movement.to_board_id},${movement.to_board_name},${movement.to_list_id},${movement.to_list_name},${movement.timestamp},${movement.remarks}`)
      .join('\n');

    fs.appendFileSync(CACHE_MOVEMENTS_FILE, csvRows + '\n', 'utf-8');
    
    // Force update the cache timestamp to now
    const nowDate = new Date();
    fs.utimesSync(CACHE_MOVEMENTS_FILE, nowDate, nowDate);
    console.log(`Updated cache timestamp to: ${nowDate.toISOString()}`);
    
    console.log(`Added ${newMovements.length} new rows to ${CACHE_MOVEMENTS_FILE}`);
  } else {
    console.log(`No new movements.`);
  }
};

// Run the script
cacheExportTrelloCardsHistory();
