import './Navbar.css';

function Navbar({ selected }){
    return(
        <div className='navbar'>
            <div className='navbar-center'>
                <div className='navbar-center-left'>
                    <h2 className='navbar-logo'>ALLPAPER</h2>
                    <button className={`navbar-select-button ${selected === 'portfolio' ? 'navbar-select-button-selected' : ''}`}>PORTFOLIO</button>
                    <button className={`navbar-select-button ${selected === 'watchlist' ? 'navbar-select-button-selected' : ''}`}>WATCHLIST</button>
                    <button className={`navbar-select-button ${selected === 'trades' ? 'navbar-select-button-selected' : ''}`}>TRADES</button>
                </div>
                <button className='navbar-sign-out-button'>SIGN OUT</button>
            </div>
        </div>
    )
}

export default Navbar;