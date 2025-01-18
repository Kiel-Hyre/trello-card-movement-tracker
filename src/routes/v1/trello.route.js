import express from 'express';
import axios from 'axios';
import config from '../../config/config.js';

const router = express.Router();

const { APPSCRIPT_HOOK_URL } = config;


router.get('/webhook', (req, res) => {
  res.status(200).send('OK'); // Must respond with 200 and 'OK' content
});

router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;

    // Validate action type
    if (payload?.action?.type === 'updateCard' && payload?.action?.data?.old?.idList) {

      const timestamp = payload.action.date;

      // Fetch old and new list names
      const oldListName = payload.action.data.listBefore.name;
      const newListName = payload.action.data.listAfter.name;

      // Prepare response data
      const details = {
        cardName: card.name,
        oldListName,
        newListName,
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
