import axios from 'axios';
import { getCardDetails } from '../../../src/scripts/services/retrieveCards';
import config from '../../../src/scripts/config';

jest.mock('axios'); // Mock axios
jest.mock('../../../src/scripts/config.js', () => ({
  BASE_URL: 'https://api.trello.com/1',
  TRELLO_API_KEY: 'mock_api_key',
  TRELLO_TOKEN: 'mock_token',
}));

describe('getCardDetails', () => {
  const { BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN } = config;
  const cardId = 'mock_card_id';

  it('should fetch card details successfully', async () => {
    // Mock API response
    const mockCardDetails = {
      id: cardId,
      name: 'Sample Trello Card',
      idList: 'list_123',
      labels: [{ name: 'Urgent' }, { name: 'Bug' }],
      dateLastActivity: '2025-01-29T00:30:54.362Z',
      closed: false,
    };

    // Mock axios.get to return the mocked response
    axios.get.mockResolvedValueOnce({ data: mockCardDetails });

    const result = await getCardDetails(cardId);

    // Verify axios was called with the correct parameters
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/cards/${cardId}`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
        fields: 'name,idList,labels,dateLastActivity,closed',
      },
    });

    // Validate the response
    expect(result).toEqual(mockCardDetails);
  });

  it('should return null and log an error if API call fails', async () => {
    // Mock an API failure
    const mockError = new Error('Request failed');
    axios.get.mockRejectedValueOnce(mockError);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getCardDetails(cardId);

    // Ensure axios was called with the correct parameters
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/cards/${cardId}`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
        fields: 'name,idList,labels,dateLastActivity,closed',
      },
    });

    // Ensure it logs an error and returns null
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching card details: ${cardId} Request failed`);
    expect(result).toBeNull();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
