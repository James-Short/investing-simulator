import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(cookieParser());

import { fetchPrices } from './fetchPrices.js';
import { userRouter } from './routes/users.js';

app.use('/users', userRouter);

//const stuff = await fetchPrices();

app.listen(8080);