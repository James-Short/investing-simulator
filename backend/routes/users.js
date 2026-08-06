import express from 'express';
import argon2 from 'argon2';

import { createCookie, createUser, getUser } from '../db/queries.js';

export const userRouter = express.Router();


userRouter.post('/createUser', async (req, res) => {
    try{
        const { username, password } = req.body;
        console.log(username, password)
        const hashedPassword = await argon2.hash(password);
        await createUser(username, hashedPassword);

        const cookieValue = await createCookie(username);
        res.cookie('session', cookieValue, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        res.status(201).send();
        return;
    } catch(error){
        console.log(error);
    }
});

userRouter.post('/signIn', async (req, res) => {
    try{
        const { username, password } = req.body;
        const userRow = await getUser(username);
        if(await argon2.verify(userRow.password_hash, password)){
            console.log("They match")
            const cookieValue = await createCookie(username);
            res.cookie('session', cookieValue, {
                maxAge: 604800000,
                httpOnly: true,
                sameSite: 'lax',
                secure: false
            });
            res.status(202).send();
            return;
        }
        else{
            console.log("They don't match")
            res.status(401).send('Username or password is incorrect!');
        }
    } catch(error){
        console.log(error);
    }
})