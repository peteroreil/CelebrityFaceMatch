'use strict';

const path = require('path');

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const config = require('config');


const SocketHandler = require('./app/SocketHandler');
const logger = require('./app/logger');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', socket => new SocketHandler(socket));

const port = config.app.port;
const host = config.app.host;

server.listen(port, host, () => {
    logger.info(`facematch listening on http://${host}:${port}`);
});
