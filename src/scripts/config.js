import dotenv from 'dotenv';

dotenv.config();

let { TRELLO_BASE_URL, TRELLO_API_KEY, TRELLO_TOKEN, APPSCRIPT_API } = process.env;


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