import axios, { AxiosResponse } from "axios";
import { config } from "../config";

const clientId: string = config.DISCORD_CLIENT_ID
const clientSecret: string = config.OAUTH2_CLIENT_SECRET
const apiBase: string = config.DISCORD_BASE_API
const redirectUri: string = config.OAUTH2_REDIRECT_URI

export async function getAuthToken(code: string): Promise<AxiosResponse> {
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };
  const headers = {
    'Authorization': `Basic ${createBasicAuthToken(clientId, clientSecret)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return await axios.post(`${apiBase}/oauth2/token`, data, {headers: headers});
}

const createBasicAuthToken = (username: string, password: string) => {
  return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}
