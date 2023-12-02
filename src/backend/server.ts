import express, {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import { Client as DbClient } from "pg";
import { config, dbConfig } from "../config";
import DatabaseClient from "./DatabaseClient";
import { getAuthToken } from "./auth";

const app = express();
const port = process.env.EXPRESS_PORT;

let dbClient: DatabaseClient | undefined


app.get("/", (_, res) => {
  res.send(200);
});

app.get("/jeeves-bot/api/auth/redirect", async (req: ExpressRequest , res: ExpressResponse) => {
  const { code } = req.query;
  const { data } = await getAuthToken(code as string);
  const { access_token, expires_in, refresh_token, scope} = data;

  if (!dbClient) {
    res.send("Conenct to DB currently unavailable, authorization not possible.")
  }
  const db = dbClient as DatabaseClient;

  db.saveAuthToken(config.DISCORD_CLIENT_ID, {
    token: access_token,
    refresh_token: refresh_token,
    expire: expires_in,
    scopes: (scope as string).split(" ")
  });

  res.send(200);
});

export const startServer = () => {
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });

  if(!dbClient) {
    dbClient = new DatabaseClient(new DbClient({
      host: dbConfig.DB_HOST,
      port: parseInt(dbConfig.DB_PORT),
      user: dbConfig.DB_USER,
      password: dbConfig.DB_PASSWORD,
      database: 'discordbot'
    }));
  }
};
