import axios from 'axios';
import { retrieveCardActionV2 } from '../../../src/scripts/services/retrieveCardActions';

jest.mock('axios'); // Mock axios

// Suppress console.error during tests
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('retrieveCardActionV2', () => {
  const BASE_URL = 'https://api.trello.com/1'; // Ensure it matches the actual implementation
  const TRELLO_API_KEY = process.env.TRELLO_API_KEY || 'mock_api_key';
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN || 'mock_token';
  const cardId = 'mock_card_id';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should fetch card actions and return them in reverse order', async () => {
    // Mock data returned by the API
    const mockActions = [
      { id: '1', type: 'updateCard', date: '2023-01-01T10:00:00Z' },
      { id: '2', type: 'createCard', date: '2023-01-01T09:00:00Z' },
    ];

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: [...mockActions], // Return a shallow copy of the mock actions
    });

    const result = await retrieveCardActionV2(cardId);

    // Ensure axios was called with the correct URL and params
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/cards/${cardId}/actions`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
        filter: 'all',
        since: null,
        before: null,
        page: 19,
      },
    });

    // Ensure the result is reversed
    expect(result).toEqual([...mockActions].reverse()); // Compare with a reversed copy of mockActions
  });

  it('should throw an error if the API call fails', async () => {
    // Mock error response
    const mockError = new Error('Error fetching data');
    mockError.response = { data: { message: 'Error fetching data' } };

    axios.get.mockRejectedValueOnce(mockError);

    await expect(retrieveCardActionV2(cardId)).rejects.toThrow(mockError);

    // Ensure axios was called with the correct URL and params
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/cards/${cardId}/actions`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
        filter: 'all',
        since: null,
        before: null,
        page: 19,
      },
    });
  });
});
