import path from 'path';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';


import { retrieveListDetail } from './services/retrieveList.js';
import { getCardDetails } from './services/retrieveCards.js';
import { getCardsFromAllBoards } from './services/retrieveCards.js';


const CACHE_DIR = path.join('src', 'tmp');
const STATUS_CSV_FILE = path.join(CACHE_DIR, 'card_status.csv');

// Ensure the directory exists
fs.mkdirSync(CACHE_DIR, { recursive: true });


export const updateStatusCsv = async () => {
  // Read existing rows from CSV if it exists
  let existingRows = fs.existsSync(STATUS_CSV_FILE)
    ? fs.readFileSync(STATUS_CSV_FILE, 'utf8')
        .split('\n')
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const [cardId, cardName, currentColumn, lastUpdate, lastActivity, tags, status] = line.split(',');
          return { 
            cardId: cardId?.trim() || '', 
            cardName: cardName?.trim() || '', 
            currentColumn: currentColumn?.trim() || '', 
            lastUpdate: lastUpdate?.trim() || new Date().toISOString(), 
            lastActivity: lastActivity?.trim() || '', 
            tags: tags?.trim() || '', 
            status: status?.trim() || 'Active',
          };
        })
        .filter((row) => row.cardId && row.cardName)
    : [];

  let updatedRows = [...existingRows]; 
  const currentCardIds = new Set();

  console.log("Update Existing Rows")

  // **Step 1: Process Existing Rows (Update In-Place)**
  for (let i = 0; i < existingRows.length; i++) {
    const row = existingRows[i];
    
    console.log(`Fetch Card Details for ${row.cardId, row.cardName}`)

    const cardDetails = await getCardDetails(row.cardId);

    if (cardDetails) {
      // Card exists, update row in-place
      const currentColumn = await retrieveListDetail(cardDetails.idList).then((res) => res.name);
      updatedRows[i] = {
        ...row,
        cardName: cardDetails.name,
        currentColumn,
        lastUpdate: new Date().toISOString(),
        lastActivity: cardDetails.dateLastActivity || '',
        tags: cardDetails.labels.map((label) => label.name).join(', ') || '',
        status: cardDetails.closed ? 'Archived' : 'Active',
      };
      currentCardIds.add(row.cardId); // Track processed cards
    }
  }

  console.log("Fetch New Rows")
  // **Step 2: Fetch All Cards from Trello**
  const allCards = await getCardsFromAllBoards();
  const newCards = allCards.filter((card) => !currentCardIds.has(card.id)); // Identify new cards

  // **Step 3: Add New Cards**
  for (const card of newCards) {

    console.log(`Fetch New Card Details for ${card.id} ${card.name}`)

    const currentColumn = await retrieveListDetail(card.idList).then((res) => res.name);
    const tags = card.labels.map((label) => label.name).join(', ') || '';
    const status = card.closed ? 'Archived' : 'Active';

    updatedRows.push({
      cardId: card.id,
      cardName: card.name,
      currentColumn,
      lastUpdate: new Date().toISOString(),
      lastActivity: card.dateLastActivity || '',
      tags,
      status,
    });

    currentCardIds.add(card.id); // Track new cards
  }

  console.log("Deleting Cards")
  // **Step 4: Detect Deleted Cards (Retain Order and Clear Fields)**
  for (let i = 0; i < existingRows.length; i++) {

    if (!currentCardIds.has(existingRows[i].cardId) && existingRows[i].status !== 'Deleted') {

      console.log(`Deleting Card for ${existingRows[i].cardId} ${existingRows[i].cardName}`)
      updatedRows[i] = {
        cardId: existingRows[i].cardId,  // Retain card ID
        cardName: existingRows[i].cardName, // Retain card name
        currentColumn: '', // Clear column
        lastUpdate: new Date().toISOString(), // Update timestamp
        lastActivity: '', // Clear last activity
        tags: '', // Clear tags
        status: 'Deleted', // Mark as deleted
      };
    }
  }

  console.log("Updating CSV")
  // **Step 5: Write to CSV (Preserving Row Order)**
  const csvWriter = createObjectCsvWriter({
    path: STATUS_CSV_FILE,
    header: [
      { id: 'cardId', title: 'Card ID' },
      { id: 'cardName', title: 'Card Name' },
      { id: 'currentColumn', title: 'Current Column' },
      { id: 'lastUpdate', title: 'Last Update' },
      { id: 'lastActivity', title: 'Last Activity' },
      { id: 'tags', title: 'Tags' },
      { id: 'status', title: 'Status' },
    ],
  });

  await csvWriter.writeRecords(updatedRows);
  console.log(`Updated card status CSV: ${STATUS_CSV_FILE}`);
};

// Run the script
updateStatusCsv();
