import cron from 'node-cron';

import { fetchPrices } from './fetchPrices.js';
import { getCurrentUserBalance, getCurrentUserValue, getOpeningPrices, updateUserSnapshots } from '../db/queries.js';
import { announceDataReady } from '../db/sockets.js';

export let openingPrices = [];


try{
    await fetchPrices();

    openingPrices = await getOpeningPrices();

    cron.schedule('30 9 * * 1-5', async () => await getOpeningPrices(), { timezone: 'America/New_York' });
    cron.schedule('*/1 * * * *', async () => { await fetchPrices(); await updateUserSnapshots(); announceDataReady()}, { timezone: 'America/New_York' });
} catch(error){
    console.log('Error in cronJobs: ', error);
}