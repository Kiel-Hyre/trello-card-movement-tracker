import axios from 'axios';
import retrieveCardActions from '../../../src/scripts/services/retrieveCardActions.js';
import config from '../../../src/scripts/config.js';

// Mock axios
jest.mock('axios');

describe('retrieveCardActions', () => {
  const cardId = 'test-card-id';

  it('should fetch card actions successfully for a valid card ID', async () => {
    // Mock API response
    const mockResponse = {
      data: [
        {
          id: 'action1',
          type: 'updateCard',
          data: {
            listBefore: { id: 'list1', name: 'To Do' },
            listAfter: { id: 'list2', name: 'In Progress' },
          },
        },
      ],
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the function
    const actions = await retrieveCardActions(cardId);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${config.BASE_URL}/cards/${cardId}/actions`, {
      params: {
        key: config.TRELLO_API_KEY,
        token: config.TRELLO_TOKEN,
        filter: 'updateCard:idList',
      },
    });
    expect(actions).toEqual(mockResponse.data); // Ensure returned data matches mock response
  });

  it('should handle errors and throw the error when the API request fails', async () => {
    // Mock API error
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function and expect it to throw an error
    await expect(retrieveCardActions(cardId)).rejects.toThrow(errorMessage);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${config.BASE_URL}/cards/${cardId}/actions`, {
      params: {
        key: config.TRELLO_API_KEY,
        token: config.TRELLO_TOKEN,
        filter: 'updateCard:idList',
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching board data:', errorMessage);

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
