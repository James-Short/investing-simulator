import './WatchlistStock.css';

function WatchlistStock({ name, price, change }){
    return(
        <div className='watchlist-stock'>
            <h3 className='watchlist-stock-header'>META</h3>
            <div className='watchlist-stock-right-container'>
                <h3 className='watchlist-stock-price'>$612.40</h3>
                <h3 className='watchlist-stock-change'>+2.30%</h3>
            </div>
        </div>
    );
}

export default WatchlistStock;