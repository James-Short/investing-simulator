import './App.css'

import axios from 'axios'

import AuthPage from './pages/AuthPage/AuthPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx'
import { useEffect, useMemo, useState, useRef } from 'react'
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
  const ws = useRef(null);
  
  const stockMap = useMemo(() => {
    if(currentStocks){
      return Object.fromEntries(currentStocks.map(stock => [stock.symbol, stock.last_trade]));
    }
    return undefined;
  }, [currentStocks]);

  const openingPriceMap = useMemo(() => {
    if(currentStocks){
      return Object.fromEntries(openingPrices.map(stock => [stock.symbol, stock.last_trade]));
    }
    return undefined;
  }, [openingPrices]);

  useEffect(() => {
    async function getStatus(){
      const res = await axios.get('http://localhost:8080/users/verifySession', {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        setSessionStatus('active');

        const socket = new WebSocket('ws://localhost:8080');
        ws.current = socket;
        
        socket.onmessage = async (message) => {
          const data = JSON.parse(message.data);
          if(data.type === 'dataReady'){
            console.log('Got data ready');
            const homepageData = await axios.get('http://localhost:8080/users/getUserHomepage', {withCredentials: true, validateStatus: () => true});
            setUserSnapshots(homepageData.data.userSnapshots);
            setCurrentUserValue(homepageData.data.currentUserValue);
            setCurrentStocks(homepageData.data.currentStocks);
            setCurrentUserBalance(homepageData.data.currentUserBalance);
          }
        }

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
  async function getUserBalance(){
    const updatedBalance = await axios.get('http://localhost:8080/users/getUserBalance', {withCredentials: true, validateStatus: () => true});
    setCurrentUserBalance(updatedBalance.data.userBalance);
  }

  async function submitOrder(orderType, symbol, quantity){
    if(orderType === 'buy'){
      const res = await axios.post('http://localhost:8080/users/buyStock', {symbol: symbol, quantity: quantity}, {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        getUserHoldings();
        getUserBalance();
      }
      else if(res.status === 422){
        alert('Your balance is lower than the price of the order you are attempting to make.');
      }
      else if(res.status === 404){
        alert('The symbol in your order was not found.');
      }
    }
    else if(orderType === 'sell'){
      const res = await axios.post('http://localhost:8080/users/sellStock', {symbol: symbol, quantity: quantity}, {withCredentials: true, validateStatus: () => true});
      if(res.status === 200){
        getUserHoldings();
        getUserBalance();
      }
      else if(res.status === 422){
        alert('You attempted to sell more shares of your listed stock than you own.');
      }
      else if(res.status === 404){
        alert('The symbol in your order was not found.');
      }
    }
  }

  async function toggleStockWatch(symbol){
    const res = await axios.post('http://localhost:8080/users/toggleStockWatch', {symbol: symbol}, {withCredentials: true, validateStatus: () => true});
    if(res.status === 200){
      const updatedWatchlist = await axios.get('http://localhost:8080/users/getUserWatchlist', {withCredentials: true, validateStatus: () => true});
      console.log(updatedWatchlist.data);
      setUserWatchlist(updatedWatchlist.data.userWatchlist);
    }
  }

  async function getStatus(){
    const res = await axios.get('http://localhost:8080/users/verifySession', {withCredentials: true, validateStatus: () => true});
    if(res.status === 200){
      setSessionStatus('active');
    }
    else{
      setSessionStatus('inactive');
    }
  }

  async function signOut(){
    const res = await axios.get('http://localhost:8080/users/signout', {withCredentials: true, validateStatus: () => true});
    if(res.status === 200){
      await getStatus();
    }
  }

  return (
    <>
      {sessionStatus === 'active' ?
        <>
          <Navbar selected={selectedTab} setSelectedTab={(tab) => setSelectedTab(tab)} signOut={() => signOut()}/>
            {selectedTab === 'portfolio' ? <HomePage userHoldings={userHoldings} userSnapshots={userSnapshots} currentUserValue={currentUserValue} stockMap={stockMap} openingPriceMap={openingPriceMap} currentUserBalance={currentUserBalance}/>:
              selectedTab === 'explore' ? <ExplorePage userWatchlist={userWatchlist} currentStocks={currentStocks} stockMap={stockMap} openingPriceMap={openingPriceMap} toggleStockWatch={(symbol) => toggleStockWatch(symbol)}/> : <TradePage submitOrder={(orderType, symbol, quantity) => submitOrder(orderType, symbol, quantity)} userHoldings={userHoldings} currentUserBalance={currentUserBalance} stockMap={stockMap}/>}</>: <>
        </>      
      }
      {sessionStatus === 'inactive' ?
        <AuthPage setSessionStatus={(status) => setSessionStatus(status)}/>: <></>      
      }
    </>
  )
}

export default App
