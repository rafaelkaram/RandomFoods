import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';

import routes from './routes';
import createConnection from './config/connection';

createConnection();
const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);
server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

export default server;