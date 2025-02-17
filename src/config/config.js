import { config as dotenvConfig } from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';
import Joi from "joi";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenvConfig({ path: path.resolve(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    TRELLO_API_KEY: Joi.string().required(),
    TRELLO_TOKEN: Joi.string().required(),
    TRELLO_BASE_URL: Joi.string().default("https://api.trello.com"),
    APPSCRIPT_HOOK_URL: Joi.string().default("https://script.google.com/macros/s/AKfycby7fQFR8Zhzl9eAx3xjP95ZEuKgUMacxEZV7PownGqZkT0xnnFGwYUOR3LXcTqmyk5W/exec")
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  TRELLO_API_KEY: envVars.TRELLO_API_KEY,
  TRELLO_TOKEN: envVars.TRELLO_TOKEN,
  TRELLO_BASE_URL: envVars.TRELLO_BASE_URL,
  APPSCRIPT_HOOK_URL: envVars.APPSCRIPT_HOOK_URL
}

export default config;