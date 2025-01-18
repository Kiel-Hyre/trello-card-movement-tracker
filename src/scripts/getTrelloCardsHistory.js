import retrieveCards from "./services/retrieveCards.js";
import retrieveCardActions from "./services/retrieveCardActions.js";

// Function to fetch cards and their action history from a Trello board
const getBoardCardsAndActions = async (boardId) => {

  const cards = await retrieveCards(boardId)

  // Fetch actions for each card
  for (const card of cards) {
    const actions = await retrieveCardActions(card.id)

    console.log(`Card: ${card.name} (ID: ${card.id})`);
    actions.forEach((action) => {
      if (action.type === 'updateCard' && action.data.listBefore && action.data.listAfter) {
        console.log(
          `  Moved from "${action.data.listBefore.name}" to "${action.data.listAfter.name}" at ${action.date}`
        );
      }
    });
  }
};

// Get board ID from command-line arguments or default to a config value
const boardId = process.argv[2] || process.env.DEFAULT_BOARD_ID;

if (!boardId) {
  console.error('Board ID is required. Pass it as a command-line argument or set DEFAULT_BOARD_ID in .env.');
  process.exit(1);
}

// Run the script
getBoardCardsAndActions(boardId);
