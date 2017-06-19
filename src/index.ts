/**
 * Created by sasha on 3/17/17.
 */
import * as http from 'http';
import * as debug from 'debug';
import {db} from './sqldb';
import {seedDatabase} from './sqldb/seed'
import App from './app';

debug('ts-express:server');

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server:http.Server = http.createServer(App);
db.connection.sync()
    .then(startServer)
    .then(seedDatabase)
    .catch(function(err) {
        console.log('Server failed to start due to error: %s', err);
    });

function startServer(){
    server.listen(port,onListening);
    server.on('error', onError);
}
function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}