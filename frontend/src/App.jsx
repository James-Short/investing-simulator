import './App.css'

import AuthPage from './pages/AuthPage/AuthPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import WatchlistPage from './pages/WatchlistPage/WatchlistPage.jsx'

function App() {
  return (
    <>
      <Navbar selected='watchlist'/>
      <WatchlistPage/>
    </>
  )
}

export default App
