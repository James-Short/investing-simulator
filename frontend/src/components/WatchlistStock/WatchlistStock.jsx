import './WatchlistStock.css';

function WatchlistStock({ name, price, change, height, width, openingPriceMap=[] }){
    return(
        <div className='watchlist-stock' style={{ height: height, width: width}}>
            <h3 className='watchlist-stock-header'>{name}</h3>
            <div className='watchlist-stock-right-container'>
                <h3 className='watchlist-stock-price'>${(price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                <h3 className='watchlist-stock-change'>{((price - openingPriceMap[name]) / 100 * openingPriceMap[name]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</h3>
            </div>
        </div>
    );
}

export default WatchlistStock;