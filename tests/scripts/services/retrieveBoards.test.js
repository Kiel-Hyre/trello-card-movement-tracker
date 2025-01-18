import axios from 'axios';
import retrieveBoards from '../../../src/scripts/services/retrieveBoards.js';
import config from '../../../src/scripts/config.js';

// Mock `axios`
jest.mock('axios');


describe('retrieveBoards', () => {
  it('should fetch boards successfully and return the data', async () => {
    // Mock API response with an empty array (valid response)
    const mockResponse = {
      status: 200,
      data: [],
    };
    axios.get.mockResolvedValue(mockResponse);
    // Call the function
    const boards = await retrieveBoards();
    // Ensure the data is returned properly, even if empty
    expect(boards).toEqual(mockResponse.data); // Boards should match the API response
  });


  it('should handle a non-empty boards array', async () => {
    // Mock API response with some boards
    const mockResponse = {
      status: 200,
      data: [
        { name: 'Board 1', id: '123' },
        { name: 'Board 2', id: '456' },
      ],
    };
    axios.get.mockResolvedValue(mockResponse);

    // Call the function
    const boards = await retrieveBoards();

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${config.BASE_URL}/members/me/boards`, {
      params: {
        key: config.TRELLO_API_KEY,
        token: config.TRELLO_TOKEN,
      },
    });

    // Ensure the data is returned properly
    expect(boards).toEqual(mockResponse.data); // Boards should match the API response
  });

  it('should handle errors gracefully and throw an Error', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('Network Error'));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Assertions
    await expect(retrieveBoards()).rejects.toThrow('Network Error'); // Ensure an error is thrown
    expect(axios.get).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Trello boards:', 'Network Error');

    // Cleanup
    consoleErrorSpy.mockRestore();
  });

});
