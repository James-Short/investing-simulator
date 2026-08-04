import WatchlistStock from '../../components/WatchlistStock/WatchlistStock';
import './WatchlistPage.css';

function WatchlistPage(){
    return(
      <div className='watchlist-page'>
        <div className='watchlist-input-container'>

        </div>
        <div className='watchlist-container'>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
            <WatchlistStock/>
        </div>
      </div>  
    );
}

export default WatchlistPage;