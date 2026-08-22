import './Navbar.css';

function Navbar({ selected, setSelectedTab }){
    return(
        <div className='navbar'>
            <div className='navbar-center'>
                <div className='navbar-center-left'>
                    <h2 className='navbar-logo'>ALLPAPER</h2>
                    <button className={`navbar-select-button ${selected === 'portfolio' ? 'navbar-select-button-selected' : ''}`} onClick={() => setSelectedTab('portfolio')}>PORTFOLIO</button>
                    <button className={`navbar-select-button ${selected === 'explore' ? 'navbar-select-button-selected' : ''}`} onClick={() => setSelectedTab('explore')}>EXPLORE</button>
                    <button className={`navbar-select-button ${selected === 'trade' ? 'navbar-select-button-selected' : ''}`} onClick={() => setSelectedTab('trade')}>TRADE</button>
                </div>
                <button className='navbar-sign-out-button'>SIGN OUT</button>
            </div>
        </div>
    )
}

export default Navbar;