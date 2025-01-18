import express from 'express';
import axios from 'axios';
import config from '../../config/config.js';

const router = express.Router();

const { TRELLO_BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN, APPSCRIPT_HOOK_URL } = config;

async function getListName(idList) {
  const url = `${TRELLO_BASE_URL}/1/lists/${idList}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
  try {
    const response = await axios.get(url);
    return response.data.name;
  } catch (error) {
    console.error('Error fetching list name:', error);
    return null;
  }
}


router.get('/webhook', (req, res) => {
  res.status(200).send('OK'); // Must respond with 200 and 'OK' content
});


router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;

    // Validate action type
    if (payload?.action?.type === 'updateCard' && payload?.action?.data?.old?.idList) {
      const { card, old } = payload.action.data;
      const timestamp = payload.action.date;

      // Fetch old and new list names
      const oldListName = await getListName(old.idList);
      const newListName = await getListName(card.idList);

      // Prepare response data
      // const details = {
      //   cardName: card.name,
      //   // oldListName,
      //   // newListName,
      //   timestamp,
      // };

      const details = {
        cardName: card.name,
        // oldListName,
        // newListName,
        oldListName: TRELLO_BASE_URL, // Assuming TRELLO_BASE_URL is defined
        newListName: JSON.stringify(payload),
        timestamp,
      };

      console.log('Extracted Details:', details);

      try {
        await axios.post(APPSCRIPT_HOOK_URL, { items: [details] });
        console.log('Details sent to Google Apps Script successfully.');
      } catch (error) {
        console.error('Error sending details to Google Apps Script:', error);
      }

      // Send response
      res.status(200).send({
        success: true,
        message: 'Details extracted successfully.',
        data: details,
      });
    } else {
      res.status(400).send({ success: false, message: 'Not the correct event.' });
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send({ success: false, message: 'Internal server error.' });
  }
});

export default router;
