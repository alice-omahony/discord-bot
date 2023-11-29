import axios, {AxiosResponse} from "axios";
import express, {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";

const app = express();
const port = process.env.EXPRESS_PORT;

const clientId: string = process.env.DISCORD_CLIENT_ID || "<clientId>";
const clientSecret: string = process.env.OAUTH2_CLIENT_SECRET || "<clientSecret>";
const apiBase: string = process.env.DISCORD_BASE_API || "https://discord.com/api/v10"
const redirectUri: string = process.env.OAUTH2_REDIRECT_URI || "http://localhost:9001/jeeves-bot/api/auth/redirect"

async function getAuthToken(code: string) {
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };
  const headers = {
    'Authorization': `Basic ${createBasicAuthToken(clientId, clientSecret)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };


  const response: AxiosResponse = await axios.post(`${apiBase}/oauth2/token`, data, {headers: headers});
  console.log(response.status, response.data);
}

const createBasicAuthToken = (username: string, password: string) => {
  return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}

app.get("/", (_, res) => {
  res.send(200);
});

app.get("/jeeves-bot/api/auth/redirect", async (req: ExpressRequest , res: ExpressResponse) => {
  const {code} = req.query;
  console.log(req);

  console.log(code);

  await getAuthToken(code as string);
  res.send(200);
});

export const startServer = () => {
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
};

// eUnbUmi5IZUnSZL9anYfziz7b9iDyw
