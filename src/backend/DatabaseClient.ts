import { Client, QueryResult} from "pg";

export interface AuthorizationData {
  token: string,
  refresh_token: string,
  expire: number,
  scopes?: string[]
}

export interface QuoteData {
  id: string,
  author: string,
  content: string,
  reporter: string,
  createdAt: string,
  updatedAt?: string
}

export interface QuoteUpdate {
  id: string,
  content: string,
  author: string,
  updatedAt: string
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
    const query = `UPDATE ${AUTH_TABLE_NAME} SET id=$1, token=$2, expire=$3, refresh_token=$4, scopes=$5`;
    const values = [id, authData.token, authData.expire, authData.refresh_token, JSON.stringify(authData.scopes)];
    
    const result: QueryResult = await this.client.query(query, values);

    const exitCode = (result.rows) ? 0 : -1;
    return Promise.resolve(exitCode);
  }

  async saveMessages(messages: QuoteData[]): Promise<number> {
    const query = `INSERT INTO ${QUOTES_TABLE_NAME} (id, name, content, reporter, reported_at) VALUES ($1,$2,$3,$4,$5)`;
    const values = messages.flatMap(msg => [msg.id, msg.author, msg.content, msg.reporter, msg.createdAt]);

    console.log(query);
    console.log(values);
    
    const result: QueryResult = await this.client.query(query, values);

    const exitCode = (result.rows) ? 0 : -1;
    return Promise.resolve(exitCode);
  }

  // TODO: add update function for quotes
  // TODO: add updatedAt timestamp to quotes table
  async update(quote: QuoteUpdate) {
    const query = `UPDATE ${QUOTES_TABLE_NAME} SET content=$1, name=$2, updated_at=$3`
    const values = [quote.content, quote.author, quote.updatedAt]

    const result: QueryResult = await this.client.query(query, values);

    const exitCode = (result.rows) ? 0 : -1;
    return Promise.resolve(exitCode);
  }

}