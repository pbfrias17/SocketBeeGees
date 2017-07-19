const path = require('path');
const express = require('express');
import mongoose from 'mongoose';
const bodyParser = require('body-parser');
const Enumerable = require('linq');
import { FindRoom } from './helpers/serverHelpers';
import passport from 'passport';
const http = require('http');
const socketServer = require('socket.io');
const app = express();

import { importUser, importRoom } from './tools/middlewares/locals';
import * as SocketEvent from './src/socket/socketEvents';

//const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//passport config
app.use(require('express-session')({
  secret: 'just wtf is this for',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//passport config

app.use(importUser);
app.use('/room/:roomNumber/', importRoom);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.get('/room/:roomNumber', (req, res) => {
  res.render('room');
});

app.get('/', (req, res) => {
  res.render('index');
});

// MONGOOSE CONNECT
// ===========================================================================

// Connection URL
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
import seedDB from './tools/mongoDB_seed';
seedDB();

var rooms = [{ roomNumber: 123, users: [{ username: 'poop', pin: '23424', roomNumber: 123 }] }];
var users = [];
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
