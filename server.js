const path = require('path');
const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketServer = require('socket.io');
const app = express();

import * as SocketEvent from './src/socket/socketEvents';

//const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('*', (req, res) => {
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

  socket.on(SocketEvent.USER_JOINREQUEST, (data) => {
    console.log('Client(' + data.name + ') is trying to join room ' + data.roomNumber);
    
    // Verify the user can join given room
    if (true)
    {
      socket.emit(SocketEvent.SERVER_JOINSUCCESS, {...data});
    }
  });

  socket.on(SocketEvent.USER_JOINROOM, (data) => {
    console.log('\tJoined Room ' + data.roomNumber);
    socket.join(data.roomNumber);
  });

  socket.on(SocketEvent.USER_SENDCHAT, (data) => {
    var { clientId, roomNumber, message } = data;
    var test = "testing";
    console.log('User sent a chat to room ' + roomNumber + ' saying:\n' + data.message);
    socket.broadcast.to(roomNumber).emit(SocketEvent.SERVER_BROADCASTCHAT, { clientId, roomNumber, message, test });
  });
});
