import './TradePage.css';

import { useState } from 'react';

function TradePage({ submitOrder }){
    const [symbolInput, setSymbolInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');

    return(
        <div className='trade-page'>
            <h3 className='trade-page-order-header'>PLACE ORDER</h3>
            <div className='trade-page-order-container'>
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
    );
}

export default TradePage;