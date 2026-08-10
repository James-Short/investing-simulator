import fs from 'node:fs/promises'
import axios from 'axios';
import { updatePrices } from '../db/queries.js';


export async function fetchPrices(){
    try{
        const symbols = (JSON.parse(await fs.readFile('watchlist.json')).companies).map(company => company.symbol);
        const { data } = await axios.get(
            'https://data.alpaca.markets/v2/stocks/trades/latest',
            {
                params: { symbols: symbols.join(',') },
                headers: {
                    'APCA-API-KEY-ID': process.env.ALPACA_KEY,
                    'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY,
                },
            }
        );
        await updatePrices(data.trades);
        return data.trades;
    } catch(error){
        console.error(error);
    }
}