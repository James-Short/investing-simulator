import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import StatsBadge from '../../components/StatsBadge/StatsBadge';
import ValueGraph from '../../components/ValueGraph/ValueGraph';
import './HomePage.css';


function HomePage({ userHoldings=[], userSnapshots=[], currentUserValue=0, stockMap=[] }){
    return(
        <div className='home-page'>
            <div className='home-page-stats-container'>
                <StatsBadge height='100%' width='23%' header='PORTFOLIO VALUE' data={'$' + currentUserValue.toLocaleString()} dataColor='white' footer='-------'/>
                <StatsBadge height='100%' width='23%' header='TOTAL P&L' data={'$' + (currentUserValue - 10000).toLocaleString()} dataColor='#20b657' footer={`${currentUserValue > 10000 ? '+' : ''}` + ((currentUserValue - 10000)/100) + '%'}/>
                <StatsBadge height='100%' width='23%' header="TODAY'S CHANGE" data='+$312.40' dataColor='#20b657' footer='+0.97%'/>
                <StatsBadge height='100%' width='23%' header='OPEN POSITIONS' data={Object.keys(userHoldings).length} dataColor='white' footer={`${Object.keys(userHoldings).length} tickers`}/>
            </div>
            <div className='home-page-graph-container'>
                <h3 className='home-page-graph-header'>Portfolio Value</h3>
                <ValueGraph height='80%' width='100%' data={userSnapshots}/>
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
                        {userHoldings.map((holding) => (
                            <tr>
                                <th scope='row' style={{color: 'white'}}>{holding.symbol}</th>
                                <th scope='row'>Filler</th>
                                <th scope='row'>{holding.quantity}</th>
                                <th scope='row'>${holding.avg_cost}</th>
                                <th scope='row' style={{color: 'white'}}>${stockMap[holding.symbol]}</th>
                                <th scope='row' style={{color: 'white'}}>${(holding.quantity * stockMap[holding.symbol]).toLocaleString()}</th>
                                <th scope='row'>+{((stockMap[holding.symbol] - holding.avg_cost) * holding.quantity).toLocaleString()}</th>
                                <th scope='row'>{(((stockMap[holding.symbol] - holding.avg_cost)/holding.avg_cost) * 100).toLocaleString()}%</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;