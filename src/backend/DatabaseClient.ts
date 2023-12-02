import { Client} from "pg";

export default class DatabaseClient {
  client: Client;

  constructor(client: Client) {
    this.client = client;
    this.client.connect()
      .then(() => console.log('Connected to PostgreSQL'))
      .catch(error => console.error('Error connecting to PostgreSQL:', error));
  }

  saveAuthToken(): Promise<number> {
    const promise = Promise.resolve(1);
    return promise;
  }

}