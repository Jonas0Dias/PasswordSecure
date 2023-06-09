import cors from "cors";
import express, { Express } from 'express';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  credentialRouter,
  networkRouter,
} from '@/routers';


const app = express()

app.use(cors());
app
  .use(express.json())
  .use('/users', usersRouter)
  .use('/signin', authenticationRouter)
  .use('/credential', credentialRouter)
  .use('/network', networkRouter)
  .use(handleApplicationErrors);
  ;


export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
  }
  
  export async function close(): Promise<void> {
    await disconnectDB();
  }
  
  
  export default app;
  