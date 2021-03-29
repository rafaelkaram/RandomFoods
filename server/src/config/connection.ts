import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  const database = process.env.NODE_ENV === 'production' ? process.env.PRD_DB : process.env.HML_DB;

  return createConnection(
    Object.assign(defaultOptions, { database })
  );
}