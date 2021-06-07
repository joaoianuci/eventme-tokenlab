import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.sentry();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  sentry() {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(Sentry.Handlers.errorHandler());
  }
}

export default new App().server;
