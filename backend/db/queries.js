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
        console.log('Error in updatePrices: ', error);
        throw error;
    }
    
}

export async function getCurrentPrices(){
    try{
        const currentPrices = await pool.query(
            `SELECT DISTINCT ON (symbol) symbol, time, last_trade FROM stocks ORDER BY symbol, time DESC`
        );
        return currentPrices.rows;

    } catch(error){
        console.log('Error in getCurrentPrices', error);
        throw error;
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
        console.log('Error in createUser: ', error);
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
        console.log('Error in getUser: ', error);
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
        return watchlist.rows[0].watchlist;
    } catch(error){
        console.log('Error in getUserWatchlist: ', error);
    }
}

export async function updateUserSnapshots(){
    try{
        const values = await pool.query(
            `SELECT
                u.id,
                u.balance + COALESCE(SUM(p.quantity * latest.last_trade), 0) AS total_user_value
            FROM users u
            LEFT JOIN positions p ON p.user_id = u.id
            LEFT JOIN(
                SELECT DISTINCT ON (symbol) symbol, last_trade, time
                FROM stocks
                ORDER BY symbol, time DESC
            ) latest ON latest.symbol = p.symbol
            GROUP BY u.id, u.balance
            `
        );
        console.log(values.rows);
        const currentDate = new Date();
        for(let stock of values.rows){
            console.log(stock);
            await pool.query(
                `INSERT INTO portfolio_snapshots (user_id, portfolio_value, recorded_at) VALUES ($1, $2, $3)`,
                [stock.id, stock.total_user_value, currentDate]
            );
        }
    } catch(error){
        console.log('Error in updateUserSnapshots: ', error);
    }
}

export async function getOpeningPrices(){
    try{
        const openingPrices = await pool.query(
            `SELECT DISTINCT ON (symbol) symbol, last_trade
            FROM stocks
            WHERE time >= CURRENT_DATE
            ORDER BY symbol, time            
            `
        );
        console.log(openingPrices);
        return openingPrices.rows;
    } catch(error){
        console.log('Error in getOpeningPrices: ', error);
    }
}