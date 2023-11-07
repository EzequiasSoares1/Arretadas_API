const app = require('../src/app');
const debug = require('debug')('api-node:server');
const http = require('http');
const chalk = require('chalk')
const os = require('os')

const port = normalizePort(process.env.PORT || '3000');
app.set('port',port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
const arch = os.arch()
const plataform = os.platform()
const type = os.type()
const mem = os.totalmem()
const cpus = os.cpus()
console.log(chalk.bgCyan.black(`SERVICE RUNNING ON PORT: ${port}`))
console.log(chalk.bgCyan.black(`SO: ${type} ${plataform} ${arch}`))
console.log(chalk.bgCyan.black(`RAM: ${Math.floor(mem * (10 ** -9))} GB`))
console.log(chalk.bgCyan.black(`CORES: ${cpus.length}`))
console.log(chalk.bgCyan.black(`CPU: ${cpus[0].model}`))

function normalizePort(val){
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }

    if (port >= 0){
        return port;
    }

    return false;
}

function onError(error){
    if (error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port == 'string'?
        'Pipe ' + port :
        'Port ' + port;

        switch (error.code){
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
}

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}