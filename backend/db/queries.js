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

export async function verifyCookieExists(sessionID){
    try{
        const sessionRow = await pool.query(
            `SELECT * FROM sessions WHERE session_id = $1`,
            [sessionID]
        );
        if(sessionRow.rows.length === 0){
            return false;
        }
        return true;
    } catch(error){
        console.log('Error in verifyCookieExists: ', error);
        throw error;
    }
}

export async function getSessionOwner(cookieValue){
    try{
        const ownerID = await pool.query(
            `SELECT user_id FROM sessions WHERE session_id = $1`,
            [cookieValue]
        );
        if(ownerID.rows.length === 0){
            return null;
        }
        return ownerID.rows[0].user_id;
    } catch(error){
        console.log('Error in getSessionOwner: ', error);
        throw error;
    }
}

export async function getUserHoldings(userID){
    try{
        const holdings = await pool.query(
            `SELECT symbol, avg_cost, quantity FROM positions WHERE user_id = $1`,
            [userID]
        );
        return holdings.rows;
    } catch(error){
        console.log('Error in getUserHoldings: ', error);
        throw error;
    }
}

export async function getUserSnapshots(userID){
    try{
        const snapshots = await pool.query(
            `SELECT portfolio_value, recorded_at FROM portfolio_snapshots WHERE user_id = $1`,
            [userID]
        );
        return snapshots.rows;
    } catch(error){
        console.log('Error in getUserSnapshots: ', error);
    }
}

export async function getCurrentUserValue(userID){
    try{
        const currentValue = await pool.query(
            `SELECT portfolio_value FROM portfolio_snapshots WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
            [userID]  
        );
        return currentValue.rows[0].portfolio_value;
    } catch(error){
        console.log('Error in getCurrentUserValue');
    }
}

export async function getUserWatchlist(userID){
    try{
        const watchlist = await pool.query(
            `SELECT watchlist FROM users WHERE id = $1`,
            [userID]
        );
        return watchlist.rows[0];

    } catch(error){

    }
}