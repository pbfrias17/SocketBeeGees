const path = require('path');
const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Enumerable = require('linq');
import { FindRoom } from './helpers/serverHelpers';
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


var rooms = [{ roomNumber: 123, users: [{ username: 'poop', pin: '23424', roomNumber: 123 }] }];
/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
var serve = http.createServer(app);
var io = socketServer(serve);
const PORT = 3000;

serve.listen(PORT,()=> {console.log("Server running, listening on port " + PORT)});

io.on('connection', (socket) => {

  socket.on(SocketEvent.USER_JOINREQUEST, (data, callback) => {    
    // Verify the user can join given room
    var newUser = { ...data };
    var roomToJoin = rooms.find(function(room) { return room.roomNumber === data.roomNumber; });
    
    var success = true;
    if (success) {
      if (roomToJoin === undefined) {
        // Initialize new room
        console.log('\tCreating Room ' + data.roomNumber);
        rooms.push({
          roomNumber: data.roomNumber,
          users: [newUser]
        });
      } else {
        console.log('\tJoin Room ' + data.roomNumber + ' with ' + roomToJoin.users.length + ' other users');
        roomToJoin.users.push(newUser);
        socket.broadcast.to(roomToJoin.roomNumber).emit(SocketEvent.SERVER_BROADCASTROOMUPDATE, roomToJoin);
      }
    }

    callback({ success, roomNumber: data.roomNumber });
  });

  socket.on(SocketEvent.USER_ENTERROOM, (data, callback) => {
    var currentRoom = rooms.find(function(room) { return room.roomNumber === parseInt(data.roomNumber); });
    console.log('Client is trying room info: ');
    console.log('\t#: ' + currentRoom.roomNumber);
    console.log('\tUsers: ' + currentRoom.users);
    socket.join(currentRoom.roomNumber);
    callback(currentRoom);
  });

  socket.on(SocketEvent.USER_SENDCHAT, (data) => {
    var { sender, roomNumber, message } = data;
    console.log('User sent a chat to room ' + roomNumber + ' saying:\n' + data.message);
    socket.broadcast.to(roomNumber).emit(SocketEvent.SERVER_BROADCASTCHAT, { sender, roomNumber, message });
  });
});
