import express from 'express';
import argon2 from 'argon2';

import { addToUserBalance, createCookie, createUser, createUserPosition, deleteUserPosition, deleteUserSession, getCurrentIndividualPrice, getCurrentPrices, getCurrentUserBalance, getCurrentUserValue, getSessionOwner, getUser, getUserHoldings, getUserSnapshots, getUserWatchlist, subtractFromUserBalance, toggleUserStockWatch, updateInitialSnapshot, verifyCookieExists } from '../db/queries.js';
import { openingPrices } from '../crons/cronJobs.js';

export const userRouter = express.Router();


userRouter.post('/createUser', async (req, res) => {
    try{
        const { username, password } = req.body;
        console.log(username, password)
        const hashedPassword = await argon2.hash(password);
        await createUser(username, hashedPassword);
        const cookieValue = await createCookie(username);
        const userID = await getSessionOwner(cookieValue);
        await updateInitialSnapshot(userID);
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

userRouter.get('/getUserHoldings', async (req, res) => {
    try{
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
        res.status(200).send(JSON.stringify({ userHoldings: userHoldings }));
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
        const currentUserBalance = await getCurrentUserBalance(userID);
        const userSnapshots = await getUserSnapshots(userID);
        const currentUserValue = await getCurrentUserValue(userID);
        const userWatchlist = await getUserWatchlist(userID);
        const currentStocks = await getCurrentPrices();
        res.status(200).send(JSON.stringify({ userHoldings: userHoldings, userSnapshots: userSnapshots, currentUserValue: currentUserValue, userWatchlist: userWatchlist,
            currentStocks: currentStocks, openingPrices: openingPrices, currentUserBalance: currentUserBalance
         }));
    } catch(error){
        console.log(error);
    }
});

userRouter.post('/buyStock', async (req, res) => {
    console.log('Buy stock')
    try{
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
            return;
        }

        const { symbol, quantity } = req.body;
        console.log(symbol, quantity);
        if(!symbol || !quantity){
            res.status(400).send('Missing required information.');
            return;
        }
        const userBalance = await getCurrentUserBalance(userID);
        const stockPrice = await getCurrentIndividualPrice(symbol);

        if(!userBalance || !stockPrice){
            res.status(404).send('Could not find requested information.');
            return;
        }

        if(stockPrice * quantity > userBalance){
            res.status(422).send('Insufficient balance for requested purchase.');
            return;
        }
        
        await subtractFromUserBalance(userID, stockPrice * quantity);
        await createUserPosition(userID, symbol, quantity);
        res.status(200).send();

    } catch(error){
        console.log(error);
    }
});

userRouter.post('/sellStock', async (req, res) => {
    try{
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
            return;
        }
        
        const { symbol, quantity } = req.body;
        if(!symbol || !quantity){
            res.status(400).send('Missing required information.');
            return;
        }
        const sellValue = await getCurrentIndividualPrice(symbol) * quantity;
        await deleteUserPosition(userID, symbol, quantity);
        await addToUserBalance(userID, sellValue);
        res.status(200).send();
    } catch(error){
        console.log(error);
    }
});

userRouter.post('/toggleStockWatch', async (req, res) => {
    try{
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
            return;
        }

        const { symbol } = req.body;

        await toggleUserStockWatch(userID, symbol);
        res.status(200).send();

    } catch(error){

    }
});

userRouter.get('/signout', async(req, res) => {
    try{
        const userCookie = req.cookies['session'];
        await deleteUserSession(userCookie);
        res.clearCookie('session');
        res.status(200).send();
    } catch(error){
        console.log(error);
    }
});