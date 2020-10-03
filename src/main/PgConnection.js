import { Client } from 'pg';
import { v4 as uuid } from 'uuid';

const CONNECTIONS = {};

export default class PgConnection {
  constructor(config) {
    this.client = new Client(config);
    this.id = uuid();
    CONNECTIONS[this.id] = this;
  }

  async connect() {
    await this.client.connect();
  }

  async fetchTables() {
    let result = await this.client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return result.rows.map(row => ({
      name: row.table_name,
      type: row.table_type
    }));
  }

  static find(id) {
    return CONNECTIONS[id];
  }
}
