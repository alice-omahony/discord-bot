import dotenv from "dotenv";
import { todo } from "node:test";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};

// TODO: Extract this duplication to something better

if (!DB_USER  || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error("Missing database environment variables");
}

export const dbConfig = {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
}