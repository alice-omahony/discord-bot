import dotenv from "dotenv";
import { todo } from "node:test";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, OAUTH2_CLIENT_SECRET, DISCORD_BASE_API, OAUTH2_REDIRECT_URI, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !OAUTH2_CLIENT_SECRET || !DISCORD_BASE_API || !OAUTH2_REDIRECT_URI) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  OAUTH2_CLIENT_SECRET, 
  DISCORD_BASE_API,
  OAUTH2_REDIRECT_URI
};

// TODO: Extract this duplication to something better

if (!DB_USER  || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error("Missing database environment variables");
}

export const dbConfig = {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
}