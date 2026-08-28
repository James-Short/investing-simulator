const connections = []

export function addConnection(ws){
    connections.push(ws);
}

export function removeConnection(ws){
    connections = connections.filter(connection => connection !== ws);
}


export function announceDataReady(){
    for(let connection of connections){
        connection.send(JSON.stringify({ type: 'dataReady' }));
    }
}