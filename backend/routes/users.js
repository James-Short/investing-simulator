import express from 'express';
import argon2 from 'argon2';

import { createUser } from '../db/queries.js';

export const userRouter = express.Router();


userRouter.post('/createUser', async (req, res) => {
    try{
        const { username, password } = req.body;
        console.log(username, password)
        const hashedPassword = await argon2.hash(password);
        await createUser(username, hashedPassword);
        res.status(201).send();
    } catch(error){
        console.log(error);
    }
});
