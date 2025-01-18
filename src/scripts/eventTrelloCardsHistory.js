import fs from 'fs';
import path from 'path';
import retrieveCardActions from './services/retrieveCardActions.js';
import retrieveCards from './services/retrieveCards.js';
import exportCardActions from './services/exportCardActions.js';

const FILE_PATH = path.join('src', 'tmp', 'event_card_movements.csv');

// Fetch movement events for cards on a specific board
const eventTrelloCardsHistory = async (boardId, cardName, oldList, newList, timestamp) => {
  let movements = [];
  const headers = 'Card Name,Old List,New List,Timestamp\n';

  // Check if the file exists
  if (fs.existsSync(FILE_PATH)) {
    console.log(`File found at ${FILE_PATH}. Retrieving existing data...`);
    const existingData = fs.readFileSync(FILE_PATH, 'utf-8');
    const rows = existingData.split('\n').slice(1).filter(row => row);

    movements = rows.map(row => {
      const [cardName, oldList, newList, timestamp] = row.split(',');
      return { cardName, oldList, newList, timestamp };
    });

    // Append additional arguments as a new item
    if (cardName && oldList && newList && timestamp) {
      const newRow = `${cardName},${oldList},${newList},${timestamp}\n`;
      fs.appendFileSync(FILE_PATH, newRow);
      console.log(`New row appended to ${FILE_PATH}`);
    }
    return;

  } else {
    console.log('File not found. Creating a new file...');
    fs.writeFileSync(FILE_PATH, headers); // Create the file with headers
  }

  // Retrieve latest cards and actions only if the file does not exist
  const cards = await retrieveCards(boardId);
  console.log(`Fetched ${cards.length} cards from board ID: ${boardId}`);

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

  // Append additional arguments as a new item
  if (cardName && oldList && newList && timestamp) {
    movements.push({ cardName, oldList, newList, timestamp });
  }

  if (movements.length === 0) {
    console.log('No card movement events found.');
  } else {
    console.log(`Writing ${movements.length} card movement events to CSV...`);
  }

  const filePath = await exportCardActions(movements, 'event_card_movements.csv');
  console.log(`Card movement data saved to ${filePath}`);
};

// Get board ID from command-line arguments or exit if not provided
const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;
const cardName = process.argv[3];
const oldList = process.argv[4];
const newList = process.argv[5];
const timestamp = process.argv[6];

if (!boardId) {
  console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
  process.exit(1);
}

// Run the script
eventTrelloCardsHistory(boardId, cardName, oldList, newList, timestamp);
