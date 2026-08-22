import './TradePage.css';

function TradePage(){
    return(
        <div className='trade-page'>
            <h3 className='trade-page-order-header'>PLACE ORDER</h3>
            <div className='trade-page-order-container'>
                <div className='trade-page-order-input-container'>
                    <label htmlFor='trade-page-ticker-input' className='trade-page-input-label'>Test</label>
                    <input type="text" className='trade-page-input' id='trade-page-ticker-input' placeholder='e.g. AAPL'/>
                </div>
                <div className='trade-page-order-input-container'>
                    <label htmlFor='trade-page-quantity-input' className='trade-page-input-label'>Test</label>
                    <input type="text" className='trade-page-input' name='trade-page-quantity-input' placeholder='0'/>
                </div>
                
                <div className='trade-page-order-button-container'>
                    <button className='trade-page-order-button trade-page-buy-order-button'>BUY</button>
                    <button className='trade-page-order-button trade-page-sell-order-button'>SELL</button>
                </div>
            </div>
        </div>
    );
}

export default TradePage;