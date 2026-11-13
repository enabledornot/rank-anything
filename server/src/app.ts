import express, { type Express } from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';


export function createApp(): Express {
  const app = express();
  const clientDist = process.env.CLIENT_DIST_PATH
    ? path.resolve(process.env.CLIENT_DIST_PATH)
    : path.resolve(__dirname, '../../client/dist/client/browser');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(session({
    name: 'rank.sid',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
    },
  }));

  app.get('/api/health', (_request, response) => {
    response.json({
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  app.use('/api/auth', authRouter);

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found' });
  });

  app.use('/users', usersRouter);

  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
  }

  app.use('/', indexRouter);
  app.use((_request, response) => {
    response.status(404).send('Not Found');
  });

  return app;
}
