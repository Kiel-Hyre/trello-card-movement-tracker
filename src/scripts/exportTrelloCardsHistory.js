
import retrieveCards from './services/retrieveCards.js';
import retrieveBoards from './services/retrieveBoards.js';
import { retrieveHistory, parseHistoryCSV } from './services/retrieveCardHistory.js';


// Fetch movement events for cards on a specific board
const exportTrelloCardsHistory = async () => {

  const boards = await retrieveBoards()

  let histories = []

  for (const board of boards) {
    console.log(`Board ${board.id} - ${board.name}`)

    const cards = await retrieveCards(board.id)
  
    // Fetch actions for each card
    for (const card of cards) {
      console.log("Get Card History ", card.id, "-", card.name)
      let history = await retrieveHistory(card)
      histories.push(...history)
    }

  }

  let filePath = await parseHistoryCSV(histories)
  console.log(`Export Complete view at ${filePath}`)
  return true

};


// Get board ID from command-line arguments or exit if not provided
// const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

// if (!boardId) {
//   console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
//   process.exit(1);
// }

// Run the script
exportTrelloCardsHistory();
