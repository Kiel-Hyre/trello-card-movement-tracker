import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import exportCardActions from '../../../src/scripts/services/exportCardActions.js';

// Mock file system and csv-writer
jest.mock('fs');
jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));

describe('exportCardActions', () => {
  const filename = 'test_card_movements.csv';
  const filePath = path.join('src', 'tmp', filename);
  const mockMovements = [
    { cardName: 'Card 1', oldList: 'To Do', newList: 'In Progress', timestamp: '2025-01-01T10:00:00Z' },
    { cardName: 'Card 2', oldList: 'In Progress', newList: 'Done', timestamp: '2025-01-02T11:00:00Z' },
  ];
  let mockWriteRecords;

  beforeEach(() => {
    // Mock mkdirSync
    fs.mkdirSync.mockImplementation(() => {});

    // Mock createObjectCsvWriter and its methods
    mockWriteRecords = jest.fn().mockResolvedValue();
    createObjectCsvWriter.mockReturnValue({
      writeRecords: mockWriteRecords,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the directory and write movements to a CSV file', async () => {
    // Call the function
    const result = await exportCardActions(mockMovements, filename);

    // Assertions
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filePath), { recursive: true });
    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: filePath,
      header: [
        { id: 'cardName', title: 'Card Name' },
        { id: 'oldList', title: 'Old Board/List Name' },
        { id: 'newList', title: 'New Board/List Name' },
        { id: 'timestamp', title: 'Timestamp' },
      ],
    });
    expect(mockWriteRecords).toHaveBeenCalledWith(mockMovements);
    expect(result).toBe(filePath); // Ensure the function returns the file path
  });

  it('should handle an empty movements array without errors', async () => {
    // Call the function with an empty array
    const result = await exportCardActions([], filename);

    // Assertions
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filePath), { recursive: true });
    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: filePath,
      header: [
        { id: 'cardName', title: 'Card Name' },
        { id: 'oldList', title: 'Old Board/List Name' },
        { id: 'newList', title: 'New Board/List Name' },
        { id: 'timestamp', title: 'Timestamp' },
      ],
    });
    expect(mockWriteRecords).toHaveBeenCalledWith([]); // Ensure empty array is passed to writeRecords
    expect(result).toBe(filePath); // Ensure the function returns the file path
  });

  it('should throw an error if writing to the file fails', async () => {
    // Mock writeRecords to throw an error
    const mockError = new Error('Write error');
    mockWriteRecords.mockRejectedValue(mockError);

    // Assertions
    await expect(exportCardActions(mockMovements, filename)).rejects.toThrow('Write error');
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filePath), { recursive: true });
    expect(mockWriteRecords).toHaveBeenCalledWith(mockMovements);
  });
});
