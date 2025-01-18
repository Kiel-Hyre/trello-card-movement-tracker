import dotenv from 'dotenv';

dotenv.config();

let { TRELLO_BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN, APPSCRIPT_API } = process.env;

// remove here
APPSCRIPT_API = "https://script.google.com/macros/s/AKfycbx_fDJit8G4-eQE-yRVeIRTZjcJNEX53nR-P00yVSJBRaJSLkVbUrHS255lL_-sxS2r/exec"

if (!TRELLO_API_KEY || !TRELLO_TOKEN || !TRELLO_BASE_URL) {
  console.error('Missing TRELLO_API_KEY or TRELLO_TOKEN in the .env file');
  process.exit(1);
}

export default {
  BASE_URL: TRELLO_BASE_URL,
  TRELLO_API_KEY,
  TRELLO_TOKEN,
  APPSCRIPT_API
}