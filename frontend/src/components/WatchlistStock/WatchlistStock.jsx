import './WatchlistStock.css';

function WatchlistStock({ name, price, change, height, width }){
    return(
        <div className='watchlist-stock' style={{ height: height, width: width}}>
            <h3 className='watchlist-stock-header'>{name}</h3>
            <div className='watchlist-stock-right-container'>
                <h3 className='watchlist-stock-price'>${price}</h3>
                <h3 className='watchlist-stock-change'>+2.30%</h3>
            </div>
        </div>
    );
}

export default WatchlistStock;