import cors from "cors";
import express, { Express } from 'express';

import { loadEnv, connectDb, disconnectDB } from '@/config';
loadEnv();

const app = express()

app.use(cors());
app.use(express.json());

//app.use([]);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
  }
  
  export async function close(): Promise<void> {
    await disconnectDB();
  }
  
  export default app;
  