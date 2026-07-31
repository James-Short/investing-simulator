import 'dotenv/config';
import YahooFinance from 'yahoo-finance2';
const YF = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

import { fetchPrices } from './fetchPrices.js';

let result;
try{
    result = await YF.quote('COST');
} catch(error){
    console.log(error);
}
const stuff = await fetchPrices();
