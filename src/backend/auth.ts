import axios, { AxiosResponse } from "axios";
import { config } from "../config";

const clientId: string = config.DISCORD_CLIENT_ID
const clientSecret: string = config.OAUTH2_CLIENT_SECRET
const apiBase: string = config.DISCORD_BASE_API
const redirectUri: string = config.OAUTH2_REDIRECT_URI

const createBasicAuthToken = (username: string, password: string) => {
  return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}

const headers = {
  'Authorization': `Basic ${createBasicAuthToken(clientId, clientSecret)}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};

export async function getAuthToken(code: string): Promise<AxiosResponse> {
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };
  return await axios.post(`${apiBase}/oauth2/token`, data, {headers: headers});
}

export async function refreshAuthToken(token: string): Promise<AxiosResponse> {
  const data = {
    grant_type: 'refresh_token',
    refresh_token: token
  }
  return await axios.post(`${apiBase}/oauth2/token`, data, {headers: headers})
}

export async function invalidateAuthToken(token: string): Promise<AxiosResponse> {
  const data = {
    token: token,
    token_type_hint: 'access_token'
  }
  return await axios.post(`${apiBase}/oauth2/token/revoke`, data, {headers: headers})
}
