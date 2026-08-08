import express from 'express';
import argon2 from 'argon2';

import { createCookie, createUser, getSessionOwner, getUser, getUserHoldings, verifyCookieExists } from '../db/queries.js';

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
        if(!userRow){
            res.status(401).send('Username or password is incorrect!');
            return;
        }
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
});

userRouter.get('/verifySession', async (req, res) => {
    console.log('Got to verify session')
    try{
        const userCookie = req.cookies['session'];
        if(!userCookie){
            res.status(404).send('Session not found!');
            return;
        }
        const cookieExists = await verifyCookieExists(userCookie);
        if(cookieExists){
           res.status(200).send('Session found!');
           return; 
        }
        else{
            res.status(404).send('Session not found!');
        }
    } catch(error){
        console.log(error);
    }
});

userRouter.get('/getUserHomepage', async (req, res) => {
    try{
        //We need portfolio value, the user's snapshots, their watchlist, their holdings, and all current prices.
        const userCookie = req.cookies['session'];
        if(!userCookie){
            res.status(404).send('Session not found!');
            return;
        }
        const cookieExists = await verifyCookieExists(userCookie);
        if(!cookieExists){
            res.status(404).send('Session not found!');
            return;
        }
        const userID = await getSessionOwner(userCookie);
        if(!userID){
            res.status(404).send('Session not found!');
        }

        const userHoldings = await getUserHoldings(userID);
        console.log(userHoldings);

    } catch(error){
        console.log(error);
    }
});