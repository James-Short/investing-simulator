import WatchlistStock from '../../components/WatchlistStock/WatchlistStock';
import './ExplorePage.css';

function ExplorePage({ userWatchlist=[], currentStocks=[], stockMap=[] }){
    return(
        <div className='explore-page'>
            <div className='explore-page-center-container'>
                <div className='explore-page-main-container'>
                    <input type="text" className='explore-page-search-input' placeholder='Search ticker or name'/>
                    <table className='explore-page-stock-table'>
                        <thead>
                            <tr>
                                <th scope='col' style={{ width: '17%' }}>TICKER</th>
                                <th scope='col' style={{ width: '27%' }}>NAME</th>
                                <th scope='col' style={{ width: '17%' }}>PRICE</th>
                                <th scope='col' style={{ width: '17%' }}>CHANGE</th>
                                <th scope='col' style={{ width: '17%' }}>MKT CAP</th>
                                <th scope='col' style={{ width: '5%' }}>A</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStocks.map((stock) => (
                                <tr>
                                    <th scope='row' style={{ color: 'white' }}>{stock.symbol}</th>
                                    <th scope='row'>Filler</th>
                                    <th scope='row' style={{ color: 'white' }}>${stock.last_trade}</th>
                                    <th scope='row' style={{ color: '#22c55e' }}>+0.87%</th>
                                    <th scope='row'>54.2m</th>
                                    <th>
                                    <button className='explore-page-stock-watch-button explore-page-stock-watch-button-watched'>
                                        <span className='explore-page-stock-watch-button-span'>☆</span>
                                    </button>
                                </th> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='explore-page-right-container'>
                    <h4 className='explore-page-watchlist-header'>WATCHLIST</h4>
                    <div className='explore-page-watchlist'>
                        {userWatchlist.map(stock => (
                            <WatchlistStock height='70px' width='100%' name={stock} price={stockMap[stock]}/>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default ExplorePage;