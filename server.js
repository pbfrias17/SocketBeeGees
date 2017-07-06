const path = require('path');
const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketServer = require('socket.io');
const app = express();

import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import * as SocketEvent from './src/socket/socketEvents';

//const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('*', (req, res) => {
	console.log('Express GET: ' + req.url);
	res.sendFile(path.join( __dirname, 'index.html'));
});
// MONGOOSE CONNECT
// ===========================================================================
// mongoose.connect('mongodb://localhost:27017/local')
//
// var db = mongoose.connection
// db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')})
// db.once('open', () => {
// 	console.log( '+++Gethyl connected to mongoose')
// })


const connections = [];
const rooms = [];

/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
var serve = http.createServer(app);
var io = socketServer(serve);
const PORT = 3000;

serve.listen(PORT,()=> {console.log("Server running, listening on port " + PORT)});

io.on('connection', (socket) => {
		let clientId = socket.id;
		let roomNumber = Math.floor(Math.random() * 1000000);
		console.log('Someone has connected');
		// /socket.emit(SocketEvent.ROOMJOIN_SUCCESS, { message: clientId + '\nConnected to room:\n' + roomNumber });

		socket.on(SocketEvent.ROOMJOIN, (data) => {
			socket.join('/' + data.roomNumber);
		});
});
