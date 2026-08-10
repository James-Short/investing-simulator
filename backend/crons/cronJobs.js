import cron from 'node-cron';

import { fetchOpeningPrices } from './fetchOpeningPrices';

try{
    fetchOpeningPrices();

    cron.schedule('30 9 * * 1-5', fetchOpeningPrices, { timezone: 'America/New_York' });
} catch(error){
    console.log('Error in cronJobs: ', error);
}