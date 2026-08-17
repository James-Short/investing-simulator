import cron from 'node-cron';

import { fetchPrices } from './fetchPrices.js';
import { getOpeningPrices, updateUserSnapshots } from '../db/queries.js';

export let openingPrices = [];

try{
    await fetchPrices();

    openingPrices = await getOpeningPrices();

    cron.schedule('30 9 * * 1-5', getOpeningPrices, { timezone: 'America/New_York' });
    cron.schedule('*/1 * * * *', updateUserSnapshots, { timezone: 'America/New_York' });
} catch(error){
    console.log('Error in cronJobs: ', error);
}