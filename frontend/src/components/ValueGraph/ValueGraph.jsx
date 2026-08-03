import { AreaChart, ResponsiveContainer, XAxis, YAxis, Area } from 'recharts';
import './ValueGraph.css';

function ValueGraph({ height, width }){
    const data = [
        { date: '2026-01-01', price: 142.50 },
        { date: '2026-01-08', price: 145.20 },
        { date: '2026-01-15', price: 139.80 },
        { date: '2026-01-22', price: 151.30 },
        { date: '2026-01-29', price: 148.90 },
        { date: '2026-02-05', price: 156.40 },
        { date: '2026-02-12', price: 153.10 },
        { date: '2026-02-19', price: 160.75 },
        { date: '2026-02-26', price: 158.20 },
        { date: '2026-03-05', price: 165.60 },
        { date: '2026-03-12', price: 162.30 },
        { date: '2026-03-19', price: 170.90 },
    ];

    return(
        <ResponsiveContainer width={width} height={height}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#22c55e' stopOpacity={0.15}/>
                        <stop offset='95%' stopColor='#2c55e' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='date' axisLine={false} tickLine={false}/>
                <YAxis dataKey='price' axisLine={false} tickLine={false}/>
                <Area type='monotone' dataKey='price' stroke='green' strokeWidth={2} fill='url(#chartGradient)'></Area>
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default ValueGraph