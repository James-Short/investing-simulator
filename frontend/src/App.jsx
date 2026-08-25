import './App.css'

import axios from 'axios'

import AuthPage from './pages/AuthPage/AuthPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx'
import { useEffect, useMemo, useState } from 'react'
import TradePage from './pages/TradePage/TradePage.jsx'

function App() {
  const [sessionStatus, setSessionStatus] = useState('');
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [userHoldings, setUserHoldings] = useState([]);
  const [userSnapshots, setUserSnapshots] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [currentUserValue, setCurrentUserValue] = useState();
  const [currentStocks, setCurrentStocks] = useState([]);
  const [openingPrices, setOpeningPrices] = useState([]);
  const [currentUserBalance, setCurrentUserBalance] = useState();
  
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
      }
      else{
        setSessionStatus('inactive');
      }
    }
    getStatus();
  }, [])

  useEffect(() => {
    async function getData(){
        const homepageData = await axios.get('http://localhost:8080/users/getUserHomepage', {withCredentials: true, validateStatus: () => true});
        setUserHoldings(homepageData.data.userHoldings)
        setUserSnapshots(homepageData.data.userSnapshots);
        setCurrentUserValue(homepageData.data.currentUserValue);
        setUserWatchlist(homepageData.data.userWatchlist);
        setCurrentStocks(homepageData.data.currentStocks);
        setOpeningPrices(homepageData.data.openingPrices);
        setCurrentUserBalance(homepageData.data.currentUserBalance);
    }
    if(sessionStatus === 'active'){
      getData();
    }
  }, [sessionStatus]);

  async function getUserHoldings(){
    const updatedHoldings = await axios.get('http://localhost:8080/users/getUserHoldings', {withCredentials: true, validateStatus: () => true});
    setUserHoldings(updatedHoldings.data.userHoldings);
  }

  async function submitOrder(orderType, symbol, quantity){
    if(orderType === 'buy'){
      const res = await axios.post('http://localhost:8080/users/buyStock', {symbol: symbol, quantity: quantity}, {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        getUserHoldings();
      }
    }
    else if(orderType === 'sell'){
      const res = await axios.post('http://localhost:8080/users/sellStock', {symbol: symbol, quantity: quantity}, {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        getUserHoldings();
      }
    }
  }

  return (
    <>
      {sessionStatus === 'active' ?
        <>
          <Navbar selected={selectedTab} setSelectedTab={(tab) => setSelectedTab(tab)}/>
            {selectedTab === 'portfolio' ? <HomePage userHoldings={userHoldings} userSnapshots={userSnapshots} currentUserValue={currentUserValue} stockMap={stockMap} openingPriceMap={openingPriceMap} currentUserBalance={currentUserBalance}/>:
              selectedTab === 'explore' ? <ExplorePage userWatchlist={userWatchlist} currentStocks={currentStocks} stockMap={stockMap} openingPriceMap={openingPriceMap}/> : <TradePage submitOrder={(orderType, symbol, quantity) => submitOrder(orderType, symbol, quantity)} userHoldings={userHoldings} currentUserBalance={currentUserBalance} stockMap={stockMap}/>}</>: <>
        </>      
      }
      {sessionStatus === 'inactive' ?
        <AuthPage setSessionStatus={(status) => setSessionStatus(status)}/>: <></>      
      }
    </>
  )
}

export default App
