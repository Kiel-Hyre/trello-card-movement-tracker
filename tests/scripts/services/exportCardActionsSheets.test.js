import axios from 'axios';
import exportCardActionsSheets from '../../../src/scripts/services/exportCardActionsSheets.js';
import config from '../../../src/scripts/config.js';

jest.mock('axios');

describe('exportCardActionsSheets', () => {
  const mockMovements = [
    { cardName: 'Card 1', oldList: 'To Do', newList: 'In Progress', timestamp: '2025-01-01T10:00:00Z' },
    { cardName: 'Card 2', oldList: 'In Progress', newList: 'Done', timestamp: '2025-01-02T11:00:00Z' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully post movements to the Google Apps Script API', async () => {
    // Mock the API response
    const mockResponse = {
      data: {
        success: true,
        message: 'Sheet updated successfully.',
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the function
    const result = await exportCardActionsSheets(mockMovements);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith(config.APPSCRIPT_API, {
      items: mockMovements,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponse.data); // Ensure the correct response is returned
  });

  it('should throw an error if the API call fails', async () => {
    // Mock API error
    const mockError = new Error('Network Error');
    axios.post.mockRejectedValue(mockError);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function and expect an error
    await expect(exportCardActionsSheets(mockMovements)).rejects.toThrow('Network Error');

    // Assertions
    expect(axios.post).toHaveBeenCalledWith(config.APPSCRIPT_API, {
      items: mockMovements,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error posting to Google Apps Script:', 'Network Error');

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
