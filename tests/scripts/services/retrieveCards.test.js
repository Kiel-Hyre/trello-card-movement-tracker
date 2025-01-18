import axios from 'axios';
import retrieveCards from '../../../src/scripts/services/retrieveCards.js';
import config from '../../../src/scripts/config.js';

// Mock axios
jest.mock('axios');

describe('retrieveCards', () => {
  const boardId = 'test-board-id';

  it('should fetch cards successfully for a valid board ID', async () => {
    // Mock API response
    const mockResponse = {
      data: [
        { id: 'card1', name: 'Card 1' },
        { id: 'card2', name: 'Card 2' },
      ],
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the function
    const cards = await retrieveCards(boardId);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${config.BASE_URL}/boards/${boardId}/cards`, {
      params: {
        key: config.TRELLO_API_KEY,
        token: config.TRELLO_TOKEN,
      },
    });
    expect(cards).toEqual(mockResponse.data); // Ensure the returned data matches the mock response
  });

  it('should handle errors and throw the error when the API request fails', async () => {
    // Mock API error
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function and assert it throws an error
    await expect(retrieveCards(boardId)).rejects.toThrow(errorMessage);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${config.BASE_URL}/boards/${boardId}/cards`, {
      params: {
        key: config.TRELLO_API_KEY,
        token: config.TRELLO_TOKEN,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching board data:', errorMessage);

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
