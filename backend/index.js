import 'dotenv/config';

import express from 'express';
const app = express();
app.use(express.json());

import { fetchPrices } from './fetchPrices.js';

import { userRouter } from './routes/users.js';

app.use('/users', userRouter);

const stuff = await fetchPrices();

app.listen(3000);