import './StatsBadge.css';

function StatsBadge({ height, width, header, data, dataColor, footer }){
    return(
        <div className='stats-badge' style={{ width: width, height: height}}>
            <h1 className='stats-badge-header'>{header}</h1>
            <h1 className='stats-badge-data' style={{ color: dataColor }}>{data}</h1>
            <h1 className='stats-badge-footer'>{footer}</h1>
        </div>
    );
}

export default StatsBadge;