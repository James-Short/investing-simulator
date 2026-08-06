import { pool } from './db.js';

import { randomUUID } from 'crypto';

export async function updatePrices(stocks){
    console.log(stocks);
    return;
    try{
        for(const [symbol, trade] of Object.entries(stocks)){
            await pool.query(
                `INSERT INTO stocks (symbol, time, last_trade) VALUES ($1, $2, $3)`,
                [symbol, trade.t, trade.p]
            );
        }
    } catch(error){
        console.log("Error in updatePrices: ", error);
    }
    
}

export async function createUser(username, hashedPassword){
    try{
        const userExists = await pool.query(
            `SELECT EXISTS (SELECT 1 FROM users WHERE username = $1);`,
            [username]
        );
        if(userExists.rows[0].exists){
            throw new Error('Username already taken');
        }

        await pool.query(
            `INSERT INTO users (username, password_hash) VALUES ($1, $2)`,
            [username, hashedPassword]
        );

    } catch(error){
        console.log("Error in createUser: ", error);
        throw error;
    }
}

export async function getUser(username){
    try{
        const userRow = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        if(userRow.rows.length == 0){
            throw new Error('User does not exist.');
        }
        return userRow.rows[0];
    } catch(error){
        console.log("Error in getUser: ", error);
        throw error;
    }
}


export async function createCookie(username){
    try{
        const userRow = await getUser(username)
        const cookieValue = randomUUID();
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        await pool.query(
            `INSERT INTO sessions (session_id, user_id, expires_at) Values ($1, $2, $3)`,
            [cookieValue, userRow.id, expirationDate]
        );
        return cookieValue;
    } catch(error){
        console.log('Error in createCookie: ', error);
    }
}