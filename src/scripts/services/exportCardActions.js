import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';


export default async (movements, filename) => {
  // Define the file path
  const filePath = path.join('src', 'tmp', filename);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // CSV Writer setup
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'cardName', title: 'Card Name' },
      { id: 'oldList', title: 'Old Board/List Name' },
      { id: 'newList', title: 'New Board/List Name' },
      { id: 'timestamp', title: 'Timestamp' },
    ],
  });
  
  await csvWriter.writeRecords(movements);
  return filePath
}