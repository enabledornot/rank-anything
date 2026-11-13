import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import { createApp } from './app';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const port = Number(process.env.PORT ?? 3000);
let app;

async function start(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI?.trim() || getLocalMongoUri();
  if (mongoUri) {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } else {
    console.log('MongoDB connection is not configured');
  }
  app = createApp();
  app.listen(port, () => {
    console.log(`Express server listening on http://localhost:${port}`);
  });
}

function getLocalMongoUri(): string | undefined {
  const username = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  if (!username || !password) return undefined;

  const host = process.env.MONGO_HOST ?? '127.0.0.1';
  const mongoPort = process.env.MONGO_PORT ?? '27017';
  const database = process.env.MONGO_DATABASE ?? 'rank_anything';
  const authSource = process.env.MONGO_AUTH_SOURCE ?? 'admin';

  return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${mongoPort}/${encodeURIComponent(database)}?authSource=${encodeURIComponent(authSource)}`;
}

start().catch((error: unknown) => {
  console.error('Failed to start the server', error);
  process.exitCode = 1;
});
