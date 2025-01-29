import fs from 'fs';
import path from 'path';


import { retrieveHistory, parseHistory } from './services/retrieveCardHistory.js';

const EVENT_CSV_FILENAME = 'event_card_movements.csv'
const FILE_PATH = path.join('src', 'tmp', EVENT_CSV_FILENAME);


// Fetch movement events for cards on a specific board
const eventTrelloCardsHistory = async (cardId, startDateTime = null, endDateTime = null) => {

  const headers = 'Card Id,Card Name,From Board Id,From Board Name,From List Id,From List Name,To Board Id,To Board Name,To List Id,To List Name,Timestamp,Remarks\n';
  const histories = await retrieveHistory({ id: cardId } , 19, 'all', startDateTime, endDateTime)
  const newMovements = await parseHistory(histories, false, true);

  // Check if the file exists
  if (fs.existsSync(FILE_PATH)) {
    console.log(`File found at ${FILE_PATH}`);
  } else {
    console.log('File not found. Creating a new file...');
    fs.writeFileSync(FILE_PATH, headers); // Create the file with headers
  }

  if (newMovements.length > 0) {
    const csvRows = newMovements
      .map(movement => `${movement.card_id},${movement.card_name},${movement.from_board_id},${movement.from_board_name},${movement.from_list_id},${movement.from_list_name},${movement.to_board_id},${movement.to_board_name},${movement.to_list_id},${movement.to_list_name},${movement.timestamp},${movement.remarks}`)
      .join('\n');

    fs.appendFileSync(FILE_PATH, csvRows + '\n', 'utf-8');
    console.log(`Added ${newMovements.length} new rows to ${FILE_PATH}`);
  } else {
    console.log(`No movement`)
  }
  
};


// Get board ID from command-line arguments or exit if not provided
// const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;
const cardId = process.argv[2];
const startDateTime = process.argv[3] || null;
const endDateTime = process.argv[4] || null;


// if (!boardId) {
//   console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
//   process.exit(1);
// }

// Run the script
eventTrelloCardsHistory(cardId, startDateTime, endDateTime);
