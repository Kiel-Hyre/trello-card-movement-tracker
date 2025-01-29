import axios from 'axios';
import { retrieveListDetail } from '../../../src/scripts/services/retrieveList';

jest.mock('axios'); // Mock axios

jest.mock('../../../src/scripts/config.js', () => ({
  BASE_URL: 'https://api.trello.com/1',
  TRELLO_API_KEY: 'mock_api_key',
  TRELLO_TOKEN: 'mock_token',
}));

// Suppress console.error during tests
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('retrieveListDetail', () => {
  const BASE_URL = 'https://api.trello.com/1';
  const TRELLO_API_KEY = 'mock_api_key';
  const TRELLO_TOKEN = 'mock_token';
  const listId = 'mock_list_id';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should fetch list details successfully', async () => {
    // Mock response data
    const mockListDetail = {
      id: 'mock_list_id',
      name: 'Mock List Name',
      idBoard: 'mock_board_id',
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: mockListDetail,
    });

    const result = await retrieveListDetail(listId);

    // Ensure axios was called with the correct URL and params
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/lists/${listId}`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });

    // Check the result matches the mocked data
    expect(result).toEqual(mockListDetail);
  });

  it('should throw an error if the API call fails', async () => {
    // Mock error response
    const mockError = new Error('Error fetching list data');
    mockError.response = { data: { message: 'Error fetching list data' } };

    axios.get.mockRejectedValueOnce(mockError);

    await expect(retrieveListDetail(listId)).rejects.toThrow(mockError);

    // Ensure axios was called with the correct URL and params
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/lists/${listId}`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });
  });
});
