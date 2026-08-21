import { pool } from './db.js';

import { randomUUID } from 'crypto';

export async function updatePrices(stocks){
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

export async function getCurrentIndividualPrice(symbol){
    try{
        const currentPrice = await pool.query(
            `SELECT last_trade FROM stocks WHERE symbol = $1 ORDER BY time DESC LIMIT 1`,
            [symbol]
        );
        return currentPrice.rows[0].last_trade;
    } catch(error){

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
        await updateInitialSnapshot();

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
        console.log('Error in getCurrentUserValue', error);
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
        const currentDate = new Date();
        for(let stock of values.rows){
            await pool.query(
                `INSERT INTO portfolio_snapshots (user_id, portfolio_value, recorded_at) VALUES ($1, $2, $3)`,
                [stock.id, stock.total_user_value, currentDate]
            );
        }
    } catch(error){
        console.log('Error in updateUserSnapshots: ', error);
    }
}

export async function updateInitialSnapshot(userID){
    try{
        const currentDate = new Date();
        await pool.query(
            `INSERT INTO portfolio_snapshots (user_id, portfolio_value, recorded_at) VALUES ($1, $2, $3)`,
            [userID, 10_000, currentDate]
        );
    } catch(error){
        console.log('Error in updateInitialSnapshot: ', error);
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
        return openingPrices.rows;
    } catch(error){
        console.log('Error in getOpeningPrices: ', error);
    }
}

export async function getCurrentUserBalance(userID){
    try{
        const userBalance = await pool.query(
            `SELECT balance FROM users WHERE id = $1`,
            [userID]
        );
        return userBalance.rows[0];
    } catch(error){
        console.log('Error in getCurrentUserBalance: ', error);
        throw error;
    }
}

export async function addToUserBalance(userID, amount){
    try{
        await pool.query(
            `UPDATE users SET balance = balance + $1 WHERE id = $2`,
            [amount, userID]
        );
    } catch(error){
        console.log('Error in addToUserBalance: ', error);
        throw error;
    }
}

export async function subtractFromUserBalance(userID, amount){
    try{
        await pool.query(
            `UPDATE users SET balance = balance - $1 WHERE id = $2`,
            [amount, userID]
        );
    } catch(error){
        console.log('Error in subtractFromUserBalance: ', error);
        throw error;
    }
}

export async function createUserPosition(userID, symbol, quantity){
    try{
        const existingPosition = await pool.query(
            `SELECT quantity, avg_cost FROM positions WHERE user_id = $1 AND symbol = $2`,
            [userID, symbol]
        );
        const currentPrice = await getCurrentIndividualPrice(symbol);
        if(existingPosition.rowCount > 0){
            const oldTotal = Number(existingPosition.rows[0].quantity) * Number(existingPosition.rows[0].avg_cost);
            const totalQuantity = Number(existingPosition.rows[0].quantity) + Number(quantity)
            const newAvg = (Number(currentPrice) * Number(quantity) + Number(oldTotal))/ Number(totalQuantity);
            await pool.query(
                `UPDATE positions SET quantity = $1, avg_cost = $2 WHERE user_id = $3 AND symbol = $4`,
                [totalQuantity, newAvg, userID, symbol]
            );
        }
        else{
            await pool.query(
                `INSERT INTO positions (user_id, symbol, quantity, avg_cost) VALUES ($1, $2, $3, $4)`,
                [userID, symbol, quantity, currentPrice]
            );
        }
    } catch(error){
        console.log('Error in createUserPosition: ', error);
        throw error;
    }
}

export async function deleteUserPosition(userID, symbol, quantity){
    try{
        const existingPosition = await pool.query(
            `SELECT quantity FROM positions WHERE user_id = $1 AND symbol = $2`,
            [userID, symbol]
        );
        if(existingPosition.rowCount === 0){
            throw new Error('User does not own the stock they are attempting to sell!');
        }
        else if(Number(existingPosition.rows[0].quantity) < Number(quantity)){
            throw new Error('User owns fewer shares than they are attempting to sell!');
        }
        else if(Number(existingPosition.rows[0].quantity) === Number(quantity)){
            await pool.query(
                `DELETE FROM positions WHERE user_id = $1 AND symbol = $2`,
                [userID, symbol]
            );
        }
        else{
            await pool.query(
                `UPDATE positions SET quantity = $1 WHERE user_id = $2 AND symbol = $3`,
                [Number(existingPosition.rows[0].quantity) - Number(quantity), userID, symbol]
            );
        }

    } catch(error){
        console.log('Error in deleteUserPosition: ', error);
        throw error;
    }
}