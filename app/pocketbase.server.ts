// import { PrismaClient } from '@prisma/client';
import PocketBase from 'pocketbase';

// const pb = new PocketBase('http://127.0.0.1:8090');

let pb: PocketBase;

declare global {
  var __db__: PocketBase;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
  pb = new PocketBase(process.env.POCKETBASE_URL);
} else {
  if (!global.__db__) {
    global.__db__ = new PocketBase(process.env.POCKETBASE_URL);
  }
  pb = global.__db__;
}

export { pb };
