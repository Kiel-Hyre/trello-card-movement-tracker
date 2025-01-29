import retrieveCards from "./services/retrieveCards.js";
import { retrieveHistory, parseHistory } from "./services/retrieveCardHistory.js";


export const getBoardCardsAndActions = async (boardId) => {

  const cards = await retrieveCards(boardId)

  // Fetch actions for each card
  for (const card of cards) {
    console.log("Get Card History ", card.id, "-", card.name)
    let history = await retrieveHistory(card)
    await parseHistory(history)
    console.log(" ----- ")
  }
  return true
};


// Get board ID from command-line arguments or default to a config value
const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

if (!boardId) {
  console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
  process.exit(1);
}

// Run the script
getBoardCardsAndActions(boardId);