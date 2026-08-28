import WatchlistStock from '../../components/WatchlistStock/WatchlistStock';
import './ExplorePage.css';

function ExplorePage({ userWatchlist=[], currentStocks=[], stockMap=[], openingPriceMap=[], toggleStockWatch }){
    return(
        <div className='explore-page'>
            <div className='explore-page-center-container'>
                <div className='explore-page-main-container'>
                    <input type="text" className='explore-page-search-input' placeholder='Search ticker or name'/>
                    <table className='explore-page-stock-table'>
                        <thead>
                            <tr>
                                <th scope='col' style={{ width: '17%' }}>TICKER</th>
                                <th scope='col' style={{ width: '17%' }}>PRICE</th>
                                <th scope='col' style={{ width: '17%' }}>CHANGE</th>
                                <th scope='col' style={{ width: '5%' }}>WATCH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStocks.map((stock) => {
                                const isPositive = (stock.last_trade >= openingPriceMap[stock.symbol]);
                                return(
                                    <tr>
                                        <th scope='row' style={{ color: 'white' }}>{stock.symbol}</th>
                                        <th scope='row' style={{ color: 'white' }}>${(stock.last_trade).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</th>
                                        <th scope='row' style={{ color: `${isPositive ? '#20b657' : 'tomato'}` }}>{((stock.last_trade - openingPriceMap[stock.symbol]) * 100 / openingPriceMap[stock.symbol]).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</th>
                                        <th>
                                            <button className={`explore-page-stock-watch-button ${userWatchlist.includes(stock.symbol) ? 'explore-page-stock-watch-button-watched' : ''}`} onClick={() => toggleStockWatch(stock.symbol)}>
                                                <span className='explore-page-stock-watch-button-span'>☆</span>
                                            </button>
                                        </th>
                                
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='explore-page-right-container'>
                    <h4 className='explore-page-watchlist-header'>WATCHLIST</h4>
                    <div className='explore-page-watchlist'>
                        {userWatchlist.map(stock => (
                            <WatchlistStock height='70px' width='100%' name={stock} price={stockMap[stock]} openingPriceMap={openingPriceMap}/>
                        ))}
                        {userWatchlist.length == 0 ? <h2 className='explore-page-watchlist-filler'>Add stocks to your watchlist!</h2> : <></>}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default ExplorePage;