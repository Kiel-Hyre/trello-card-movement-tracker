
import retrieveCardActions from './services/retrieveCardActions.js';
import retrieveCards from './services/retrieveCards.js';
import exportCardActionsSheets from './services/exportCardActionsSheets.js';


// Fetch movement events for cards on a specific board
const exportTrelloCardsHistorySheets = async (boardId) => {

  const cards = await retrieveCards(boardId)
  console.log(`Fetched ${cards.length} cards from board ID: ${boardId}`);

  const movements = [];

  for (const card of cards) {
    const actions = await retrieveCardActions(card.id)

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
  }

  const {message} = await exportCardActionsSheets(movements)
  console.log(`Card movement data saved. ${message}`);
};


// Get board ID from command-line arguments or exit if not provided
const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

if (!boardId) {
  console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
  process.exit(1);
}

// Run the script
exportTrelloCardsHistorySheets(boardId);
