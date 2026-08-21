import './App.css'

import axios from 'axios'

import AuthPage from './pages/AuthPage/AuthPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx'
import { useEffect, useMemo, useState } from 'react'

function App() {
  const [sessionStatus, setSessionStatus] = useState('');
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [userHoldings, setUserHoldings] = useState([]);
  const [userSnapshots, setUserSnapshots] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [currentUserValue, setCurrentUserValue] = useState();
  const [currentStocks, setCurrentStocks] = useState([]);
  const [openingPrices, setOpeningPrices] = useState([]);
  
  const stockMap = useMemo(() => {
    return Object.fromEntries(currentStocks.map(stock => [stock.symbol, stock.last_trade]));
  }, [currentStocks]);

  const openingPriceMap = useMemo(() => {
    return Object.fromEntries(openingPrices.map(stock => [stock.symbol, stock.last_trade]))
  });

  useEffect(() => {
    async function getStatus(){
      const res = await axios.get('http://localhost:8080/users/verifySession', {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        setSessionStatus('active');
        const homepageData = await axios.get('http://localhost:8080/users/getUserHomepage', {withCredentials: true, validateStatus: () => true});
        const test = await axios.post('http://localhost:8080/users/sellStock', {
          symbol: 'GOOGL',
          quantity: '1'
        }, {withCredentials: true, validateStatus: () => true});
        setUserHoldings(homepageData.data.userHoldings)
        setUserSnapshots(homepageData.data.userSnapshots);
        setCurrentUserValue(homepageData.data.currentUserValue);
        setUserWatchlist(homepageData.data.userWatchlist);
        setCurrentStocks(homepageData.data.currentStocks);
        setOpeningPrices(homepageData.data.openingPrices);
      }
      else{
        setSessionStatus('inactive');
      }
    }
    getStatus();
  }, [])

  useEffect(() => {
    console.log(sessionStatus);
  }, [sessionStatus]);

  return (
    <>
      {sessionStatus === 'active' ?
        <>
        <Navbar selected={selectedTab} setSelectedTab={(tab) => setSelectedTab(tab)}/>
          {selectedTab === 'portfolio' ? <HomePage userHoldings={userHoldings} userSnapshots={userSnapshots} currentUserValue={currentUserValue} stockMap={stockMap} openingPriceMap={openingPriceMap}/>:
           <ExplorePage userWatchlist={userWatchlist} currentStocks={currentStocks} stockMap={stockMap} openingPriceMap={openingPriceMap}/>}</>: <>
        </>      
      }
      {sessionStatus === 'inactive' ?
        <AuthPage setSessionStatus={(status) => setSessionStatus(status)}/>: <></>      
      }
    </>
  )
}

export default App
