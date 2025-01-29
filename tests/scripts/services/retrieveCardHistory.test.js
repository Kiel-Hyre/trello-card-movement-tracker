import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import {
  retrieveHistory,
  parseHistory,
  parseHistoryCSV,
  parseHistorySheets,
} from '../../../src/scripts/services/retrieveCardHistory';
import { retrieveCardActionV2 } from '../../../src/scripts/services/retrieveCardActions';
import { retrieveListDetail } from '../../../src/scripts/services/retrieveList';

jest.mock('axios');
jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));
jest.mock('../../../src/scripts/services/retrieveCardActions');
jest.mock('../../../src/scripts/services/retrieveList');
jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('Card History Services', () => {
  const mockCard = { id: 'mock_card_id', name: 'Mock Card' };
  const mockActions = [
    {
      id: '1',
      type: 'updateCard',
      date: '2023-01-01T10:00:00Z',
      data: {
        listBefore: { id: 'list_1', name: 'To Do' },
        listAfter: { id: 'list_2', name: 'In Progress' },
        card: { id: 'mock_card_id', name: 'Mock Card' },
        board: { id: 'board_1', name: 'Board 1' },
      },
    },
    {
      id: '2',
      type: 'createCard',
      date: '2023-01-01T09:00:00Z',
      data: {
        card: { id: 'mock_card_id', name: 'Mock Card' },
        board: { id: 'board_1', name: 'Board 1' },
        list: { id: 'list_1', name: 'To Do' },
      },
    },
  ];

  beforeEach(() => {
    retrieveCardActionV2.mockResolvedValue(mockActions);
    retrieveListDetail.mockResolvedValue({ id: 'list_1', name: 'To Do' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return card actions as history', async () => {
    const result = await retrieveHistory(mockCard);

    expect(result.length).toBeGreaterThan(0);
    expect(retrieveCardActionV2).toHaveBeenCalledWith(
      'mock_card_id',
      19,
      'all',
      null,
      null
    );
  });

  it('should parse history into movements', async () => {
    const result = await parseHistory(mockActions, true, true);

    expect(result.length).toBe(2);
    expect(result[0].remarks).toBe('Created Card');
    expect(result[1].remarks).toBe('Update Card');
  });

  it('should write movements to a CSV file', async () => {
    const mockCsvWriter = { writeRecords: jest.fn().mockResolvedValue() };
    createObjectCsvWriter.mockReturnValue(mockCsvWriter);

    const filePath = await parseHistoryCSV(mockActions);

    expect(mockCsvWriter.writeRecords).toHaveBeenCalled();
    expect(filePath).toEqual(expect.stringContaining('card_movements.csv'));
  });

  it('should post movements to Google Apps Script', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Data posted successfully!' } });

    const result = await parseHistorySheets(mockActions);

    expect(result).toBe('Data posted successfully!');
    expect(axios.post).toHaveBeenCalled();
  });
});
