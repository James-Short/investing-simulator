import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(cookieParser());

import { fetchPrices } from './crons/fetchPrices.js';
import { userRouter } from './routes/users.js';
import { getSessionOwner } from './db/queries.js';

app.use('/users', userRouter);

//const stuff = await fetchPrices();
await getSessionOwner();


app.listen(8080);