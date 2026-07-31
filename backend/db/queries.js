import { pool } from './db.js';

export async function updatePrices(stocks){
    try{
        for(const [symbol, trade] of Object.entries(stocks)){
            await pool.query(
                `INSERT INTO stocks (symbol, time, last_trade) VALUES ($1, $2, $3)`,
                [symbol, trade.t, trade.p]
            );
        }
    } catch(error){
        console.log(error);
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
            `INSERT INTO USERS (username, password_hash) VALUES ($1, $2)`,
            [username, hashedPassword]
        );

    } catch(error){
        console.log(error);
    }
}