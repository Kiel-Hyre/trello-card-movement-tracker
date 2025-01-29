import retrieveBoards from "./services/retrieveBoards.js"


export const getTrelloBoards = async () => {
  const boards = await retrieveBoards()
  console.log('Your Trello Boards:')

  if (!boards || boards.length === 0) {
    console.log('No boards found.')
    return
  }

  boards.forEach((board) => {
    console.log(`- Name: ${board.name}, ID: ${board.id}`)
  })
}

// Done
// Run the script
getTrelloBoards()