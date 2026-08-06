import 'dotenv/config';

import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

import { fetchPrices } from './fetchPrices.js';

import { userRouter } from './routes/users.js';

app.use('/users', userRouter);

//const stuff = await fetchPrices();

app.listen(8080);