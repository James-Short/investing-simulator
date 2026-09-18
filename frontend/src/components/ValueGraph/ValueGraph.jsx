import { AreaChart, ResponsiveContainer, XAxis, YAxis, Area, Label, Tooltip } from 'recharts';
import './ValueGraph.css';

function ValueGraph({ height, width, data }){
    if(Object.values(data).length === 0){
        return null;
    }

    function getDateFormat(spanMs){
        const hour = 60 * 60 * 1000;
        const day = 24 * hour;

        if(spanMs > 90 * day){
            return{
                format: date =>
                    date.toLocaleString('en-US', {month: 'short'}),
            };
        }
        if(spanMs > 7 * day){
            return{
                format: date =>
                    date.toLocaleString('en-US', {month: 'short', day: 'numeric'}),
            };
        }
        if(spanMs > day){
            return{
                format: date =>
                    date.toLocaleString('en-US', {weekday: 'short', day: 'numeric'}),
            };
        }
        return{
            format: date =>
                date.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit'}),
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {notation: 'compact', compactDisplay: 'short'});
    const values = Object.values(data);
    const { format } = getDateFormat(new Date(values[values.length - 1].recorded_at).getTime() -
                     new Date(values[0].recorded_at).getTime());
    return(
        <ResponsiveContainer width={width} height={height}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#22c55e' stopOpacity={0.15}/>
                        <stop offset='95%' stopColor='#2c55e' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='recorded_at' axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} interval='preserveStartEnd' fontSize='90%'
                    tickFormatter={(date) => format(new Date(date))}
                />
                <YAxis dataKey='portfolio_value' axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} fontSize='90%' 
                    domain={[(dataMin) => Math.floor(dataMin * 0.98), (dataMax) => Math.ceil(dataMax * 1.02)]}
                    tickFormatter={(value) => '$' + formatter.format(value)}
                />
                <Area type='monotone' dataKey='portfolio_value' stroke='green' strokeWidth={2} fill='url(#chartGradient)'></Area>
                <Tooltip/>
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default ValueGraph