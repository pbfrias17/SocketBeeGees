import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Enumerable from 'linq';
import passport from 'passport';
import http from 'http';
import socketServer from 'socket.io';

import User from './models/user';
import { importUser, verifyRoomAccessForUser } from './tools/middlewares/locals';
import * as SocketEvent from './src/socket/socketEvents';

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Configure Authentication
app.use(require('express-session')({
  secret: 'just wtf is this for',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Remaining App Configuration
app.use(importUser);
app.use('/room', verifyRoomAccessForUser);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Route Management
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/room', (req, res) => {
  if (res.locals.room === null) {
    res.render('roomNotFound');
  } else if (!res.locals.userVerifiedForRoomAccess) {
    res.render('roomNotAccessible');
  } else {
    res.render('room');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// MONGOOSE CONNECT
// ===========================================================================
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

// Connect to local Mongo Database
mongoose.connect(url);
mongoose.Promise = require('bluebird');

var db = mongoose.connection;
db.on('error', ()=> {console.log( 'FAILED to connect to mongoose')});
db.once('open', () => {
 	console.log( 'SUCCESSFULLY connected to mongoose')
});

// Seed Database
import seedDB from './tools/mongoDB_seed';
seedDB();

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

  socket.on(SocketEvent.USER_JOINROOM, (user) => {
    users.push(user);
  });

  socket.on(SocketEvent.USER_GETROOM, (data, callback) => {
    var currentRoom = rooms.find(function(room) { return room.roomNumber === parseInt(data.roomNumber); });
    socket.join(currentRoom.roomNumber);
    callback(currentRoom);
  });

  socket.on(SocketEvent.USER_SENDCHAT, (data) => {
    var { sender, roomNumber, message } = data;
    console.log(sender.username + ' sent a chat to room ' + roomNumber + ' saying:\n' + data.message);
    socket.broadcast.to(roomNumber).emit(SocketEvent.SERVER_BROADCASTCHAT, { sender, roomNumber, message });
  });
});
