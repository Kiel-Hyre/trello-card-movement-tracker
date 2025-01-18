import axios from 'axios';
import config from "../config.js";


export default async (movements) => {
  try {
    // Define the URL of the Google Apps Script Web App
    const url = config.APPSCRIPT_API;

    // Define the payload
    const payload = {
      items: movements,
    };

    // Make a POST request to the Web App
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the Google Apps Script Web App
    return response.data;
  } catch (error) {
    // Log and rethrow the error for further handling
    console.error('Error posting to Google Apps Script:', error.message);
    throw error;
  }
};