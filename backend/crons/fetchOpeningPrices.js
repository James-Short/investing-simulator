import cron from 'node-cron';
import axios from 'axios';
import { fetchPrices } from './fetchPrices';

export let openingPrices = [];

export async function fetchOpeningPrices(){
    try{
        openingPrices = await fetchPrices();
    } catch(error){
        throw error;
    }
}

try{
    await fetchOpeningPrices();
} catch(error){
    console.log('Error fetching opening prices: ', error);
}

cron.schedule('30 9 * * 1-5', async() => {
    try{
        await fetchOpeningPrices();
    } catch(error){
        console.log('Error fetching opening prices: ', error);
    }
});
