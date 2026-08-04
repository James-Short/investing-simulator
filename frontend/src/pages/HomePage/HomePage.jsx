import Navbar from '../../components/Navbar/Navbar';
import StatsBadge from '../../components/StatsBadge/StatsBadge';
import ValueGraph from '../../components/ValueGraph/ValueGraph';
import './HomePage.css';


function HomePage(){
    return(
        <div className='home-page'>
            <div className='home-page-stats-container'>
                <StatsBadge height='100%' width='23%' header='PORTFOLIO VALUE' data='$25,721.34' dataColor='white' footer='-------'/>
                <StatsBadge height='100%' width='23%' header='TOTAL P&L' data='+$75.40' dataColor='#20b657' footer={'+0.29%'}/>
                <StatsBadge height='100%' width='23%' header="TODAY'S CHANGE" data='+$312.40' dataColor='#20b657' footer='+0.97%'/>
                <StatsBadge height='100%' width='23%' header='OPEN POSITIONS' data='6' dataColor='white' footer='6 tickers'/>
            </div>
            <div className='home-page-graph-container'>
                <h3 className='home-page-graph-header'>Portfolio Value</h3>
                <ValueGraph height='80%' width='100%'/>
            </div>
            <div className='home-page-holdings-container'>
                <h1 className='home-page-holdings-header'>HOLDINGS</h1>
                <table className='home-page-holdings-table'>
                    <thead>
                        <tr>
                            <th scope='col'>TICKER</th>
                            <th scope='col'>NAME</th>
                            <th scope='col'>SHARES</th>
                            <th scope='col'>AVG COST</th>
                            <th scope='col'>LAST</th>
                            <th scope='col'>VALUE</th>
                            <th scope='col'>P&L</th>
                            <th scope='col'>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                        <tr>
                            <th scope='row' style={{color: 'white'}}>AAPL</th>
                            <th scope='row'>Apple Inc.</th>
                            <th scope='row'>14</th>
                            <th scope='row'>$174.20</th>
                            <th scope='row' style={{color: 'white'}}>$211.45</th>
                            <th scope='row' style={{color: 'white'}}>$2,960.30</th>
                            <th scope='row'>+$521.50</th>
                            <th scope='row'>+21.38%</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;