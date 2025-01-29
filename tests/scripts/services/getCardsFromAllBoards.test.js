import axios from 'axios';
import { retrieveCardsV2, getCardsFromAllBoards } from '../../../src/scripts/services/retrieveCards.js';
import retrieveBoards from '../../../src/scripts/services/retrieveBoards.js';
import config from '../../../src/scripts/config.js'; // Import config to mock it

jest.mock('axios'); // Mock axios
jest.mock('../../../src/scripts/services/retrieveBoards.js'); // Mock retrieveBoards
jest.mock('../../../src/scripts/config.js', () => ({
  BASE_URL: 'https://api.trello.com/1',
  TRELLO_API_KEY: 'mock_api_key',
  TRELLO_TOKEN: 'mock_token',
}));

describe('retrieveCardsV2', () => {
  const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config;
  const boardId = 'mock_board_id';

  it('should fetch cards from a board successfully', async () => {
    // Mock API response
    const mockCards = [
      { id: 'card_1', name: 'Card 1' },
      { id: 'card_2', name: 'Card 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockCards });

    const result = await retrieveCardsV2(boardId);

    // Verify axios was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/boards/${boardId}/cards`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });

    // Validate the response
    expect(result).toEqual(mockCards);
  });

  it('should throw an error if fetching cards fails', async () => {
    // Mock API failure
    const mockError = new Error('Request failed');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(retrieveCardsV2(boardId)).rejects.toThrow('Request failed');
  });
});

describe('getCardsFromAllBoards', () => {
  it('should fetch cards from multiple boards', async () => {
    // Mock board response
    const mockBoards = [
      { id: 'board_1', name: 'Board 1' },
      { id: 'board_2', name: 'Board 2' },
    ];
    retrieveBoards.mockResolvedValueOnce(mockBoards);

    // Mock card responses for each board
    const mockCardsBoard1 = [{ id: 'card_1', name: 'Card A' }];
    const mockCardsBoard2 = [{ id: 'card_2', name: 'Card B' }];

    axios.get.mockResolvedValueOnce({ data: mockCardsBoard1 }); // First board
    axios.get.mockResolvedValueOnce({ data: mockCardsBoard2 }); // Second board

    const result = await getCardsFromAllBoards();

    // Validate that retrieveBoards was called
    expect(retrieveBoards).toHaveBeenCalledTimes(1);

    // Ensure axios was called twice (one per board)
    expect(axios.get).toHaveBeenCalledTimes(2);

    // Validate the combined results
    expect(result).toEqual([...mockCardsBoard1, ...mockCardsBoard2]);
  });

  it('should return an empty array if no boards exist', async () => {
    retrieveBoards.mockResolvedValueOnce([]);

    const result = await getCardsFromAllBoards();

    expect(retrieveBoards).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
