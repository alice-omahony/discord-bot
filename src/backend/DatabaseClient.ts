import { Client, QueryResult} from "pg";

export type AuthorizationData = {
  token: string,
  refresh_token: string,
  expire: number,
  scopes?: string[]
}

export type QuoteData = {
  id: string,
  author: string,
  content: string,
  reporter: string,
  timestamp: string
}

const AUTH_TABLE_NAME: string = "auth";
const QUOTES_TABLE_NAME: string = "quotes";
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
    
    const result: QueryResult = await this.client.query(query, values);

    const exitCode = (result.rows) ? 0 : -1;
    return Promise.resolve(exitCode);
  }

  async saveMessages(messages: QuoteData[]): Promise<number> {
    const query = `INSERT INTO ${QUOTES_TABLE_NAME} (id, name, content, reporter, reported_at) VALUES ($1,$2,$3,$4,$5)`
    const values = messages.flatMap(msg => [msg.id, msg.author, msg.content, msg.reporter, msg.timestamp]);

    console.log(query);
    console.log(values);
    
    const result: QueryResult = await this.client.query(query, values);

    const exitCode = (result.rows) ? 0 : -1;
    console.log(exitCode);
    return Promise.resolve(exitCode);
  }

}