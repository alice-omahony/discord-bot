import express, {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import { Client as DbClient } from "pg";
import { dbConfig } from "../config";
import DatabaseClient from "./DatabaseClient";
import { getAuthToken } from "./auth";

const app = express();
const port = process.env.EXPRESS_PORT;

let dbClient: DatabaseClient | undefined


app.get("/", (_, res) => {
  res.send(200);
});

app.get("/jeeves-bot/api/auth/redirect", async (req: ExpressRequest , res: ExpressResponse) => {
  const {code} = req.query;
  await getAuthToken(code as string);
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
      password: dbConfig.DB_PASSWORD
    }));
  }
};
