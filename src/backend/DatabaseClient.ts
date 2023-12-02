import { Client} from "pg";

export type AuthorizationData = {
  token: string,
  refresh_token: string,
  expire: number,
  scopes?: string[]
}

const AUTH_TABLE_NAME: string = "auth";
export default class DatabaseClient {
  client: Client;

  constructor(client: Client) {
    this.client = client;
    this.client.connect()
      .then(() => console.log('Connected to PostgreSQL'))
      .catch(error => console.error('Error connecting to PostgreSQL:', error));
  }

  async saveAuthToken(id: string, authData: AuthorizationData): Promise<number> {
    const query = `UPDATE ${AUTH_TABLE_NAME} SET id=$1, token=$2, expire=$3, refresh_token=$4, scopes=$5`
    const values = [id, authData.token, authData.expire, authData.refresh_token, JSON.stringify(authData.scopes)]
    
    await this.client.query(query, values)
    
    
    const promise = Promise.resolve(1);
    return promise;
  }

}