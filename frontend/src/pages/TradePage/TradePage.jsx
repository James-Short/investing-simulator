import StatsBadge from '../../components/StatsBadge/StatsBadge';
import './TradePage.css';

import { useState } from 'react';

function TradePage({ submitOrder, userHoldings=[], currentUserBalance=0, stockMap=[] }){
    const [symbolInput, setSymbolInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');

    return(
        <div className='trade-page'>
            <div className='trade-page-top-container'>
                <div className='trade-page-order-container'>
                    <h3 className='trade-page-order-header'>PLACE ORDER</h3>
                    <div className='trade-page-order-container-bottom'>
                        <div className='trade-page-order-input-container'>
                            <label htmlFor='trade-page-ticker-input' className='trade-page-input-label'>TICKER</label>
                            <input type="text" className='trade-page-input' id='trade-page-ticker-input' placeholder='e.g. AAPL' onChange={(e) => setSymbolInput(e.target.value)}/>
                        </div>
                        <div className='trade-page-order-input-container'>
                            <label htmlFor='trade-page-quantity-input' className='trade-page-input-label'>SHARES</label>
                            <input type="text" className='trade-page-input' name='trade-page-quantity-input' placeholder='0' onChange={(e) => setQuantityInput(e.target.value)}/>
                        </div>
                        
                        <div className='trade-page-order-button-container'>
                            <button className='trade-page-order-button trade-page-buy-order-button' onClick={() => submitOrder('buy', symbolInput, quantityInput)}>BUY</button>
                            <button className='trade-page-order-button trade-page-sell-order-button' onClick={() => submitOrder('sell', symbolInput, quantityInput)}>SELL</button>
                        </div>
                    </div>
                </div>
                <StatsBadge width='25%' height='100%' header='CASH BALANCE' footer={'----'} dataColor='white' data={'$' + currentUserBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/>
            </div>
            <div className='trade-page-holdings-container'>
                <h3 className='trade-page-holdings-header'>HOLDINGS</h3>
                <table className='trade-page-holdings-table'>
                        <thead>
                            <tr>
                                <th scope='col'>TICKER</th>
                                <th scope='col'>SHARES</th>
                                <th scope='col'>AVG COST</th>
                                <th scope='col'>LAST</th>
                                <th scope='col'>VALUE</th>
                                <th scope='col'>P&L</th>
                                <th scope='col'>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userHoldings.map((holding) => {
                                const isPositive = stockMap[holding.symbol] >= holding.avg_cost;
                                return(
                                    <tr>
                                        <th scope='row' style={{color: 'white'}}>{holding.symbol}</th>
                                        <th scope='row'>{holding.quantity}</th>
                                        <th scope='row'>${(holding.avg_cost).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</th>
                                        <th scope='row' style={{color: 'white'}}>${(stockMap[holding.symbol]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</th>
                                        <th scope='row' style={{color: 'white'}}>${(holding.quantity * stockMap[holding.symbol]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</th>
                                        <th scope='row' style={{color: `${isPositive ? '#20b657' : 'tomato'}`}}>{isPositive ? '+' : '-'}${Math.abs(((stockMap[holding.symbol] - holding.avg_cost) * holding.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</th>
                                        <th scope='row' style={{color: `${isPositive ? '#20b657' : 'tomato'}`}}>{isPositive ? '+' : ''}{(((stockMap[holding.symbol] - holding.avg_cost)/holding.avg_cost) * 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}

export default TradePage;