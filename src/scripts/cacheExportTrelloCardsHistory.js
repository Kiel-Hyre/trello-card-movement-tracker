import fs from 'fs';
import path from 'path';
import retrieveCardActions from './services/retrieveCardActions.js';
import retrieveCards from './services/retrieveCards.js';
import exportCardActions from './services/exportCardActions.js';

const CACHE_DIR = path.join('src', 'tmp');
const CACHE_TIMELOG_FILE = path.join(CACHE_DIR, 'cache_timelog.txt');
const CACHE_MOVEMENTS_FILE = path.join(CACHE_DIR, 'cached_card_movements.csv');

// Fetch movement events for cards on a specific board
const cacheExportTrelloCardsHistory = async (boardId) => {
  // Ensure the cache directory exists
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const now = new Date();

  // Check if cache_timelog.txt exists
  let isOlderThan24Hours = true;
  if (fs.existsSync(CACHE_TIMELOG_FILE)) {
    const cachedTimelog = fs.readFileSync(CACHE_TIMELOG_FILE, 'utf-8');
    const cachedTime = new Date(cachedTimelog);
    isOlderThan24Hours = (now - cachedTime) > 24 * 60 * 60 * 1000;
  } else {
    // Create the timelog file with the current datetime if it doesn't exist
    console.log('Timelog file not found. Creating a new one.');
    fs.writeFileSync(CACHE_TIMELOG_FILE, now.toISOString(), 'utf-8');
  }

  // If the cache is valid and the CSV file exists, use the cached CSV
  if (!isOlderThan24Hours && fs.existsSync(CACHE_MOVEMENTS_FILE)) {
    console.log(`Cache is up to date. Using cached data from ${CACHE_MOVEMENTS_FILE}`);
    return;
  } else {
    console.log(`Fetching new data`)
  }

  // Update the cache timestamp
  fs.writeFileSync(CACHE_TIMELOG_FILE, now.toISOString(), 'utf-8');

  // Retrieve new data
  const cards = await retrieveCards(boardId);
  console.log(`Fetched ${cards.length} cards from board ID: ${boardId}`);

  const movements = [];

  for (const card of cards) {
    const actions = await retrieveCardActions(card.id);

    actions.forEach((action) => {
      if (action.type === 'updateCard' && action.data.listBefore && action.data.listAfter) {
        movements.push({
          cardName: card.name,
          oldList: action.data.listBefore.name,
          newList: action.data.listAfter.name,
          timestamp: action.date,
        });
      }
    });
  }

  if (movements.length === 0) {
    console.log('No card movement events found.');
  } else {
    console.log(`Writing ${movements.length} card movement events to CSV...`);
    const filePath = await exportCardActions(movements, 'cached_card_movements.csv');
    console.log(`Card movement data saved to ${filePath}`);
  }
};

// Get board ID from command-line arguments or exit if not provided
const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

if (!boardId) {
  console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
  process.exit(1);
}

// Run the script
cacheExportTrelloCardsHistory(boardId);
