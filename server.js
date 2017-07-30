import path from 'path';
import express from 'express';
import ReactEngine from 'express-react-engine';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Enumerable from 'linq';
import passport from 'passport';
import http from 'http';
import socketServer from 'socket.io';
import { AddUserToRoom } from './tools/serverHelper';

import User from './models/user';
import Room from './models/room';
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

app.set('views', path.join(__dirname, 'src/views/routes'));
app.set('view engine', 'ejs');


// ROUTES/API MANAGEMENT
// ===========================================================================
app.get('/', (req, res) => {
  res.render('home');
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

app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      req.flash('reg_error', err.message);
      res.redirect('/register');
    } else {
      // if registration successful, login user
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      });
    }
  });
});

app.post('/create', (req, res) => {
  var { roomNumber } = req.body;
  Room.findOne({ roomNumber }, (err, room) => {
    if (err) {
      console.log('ERR on POST /create');
      res.redirect('/');      
    } else {
      if (room) {
        console.log('Unable to create room ' + roomNumber + ' since it already exists');
        res.redirect('/');
      } else {
        console.log('Creating room ' + roomNumber);
        var newRoom = new Room({ roomNumber });
        AddUserToRoom(req.user, newRoom, res);
      }
    }
  });
});

app.post('/join', (req, res) => {
  var { roomNumber } = req.body;
  Room.findOne({ roomNumber }).
    populate('users').
    exec((err, room) => {
      if (err) {
        console.log('ERR on POST /join find room');
        res.redirect('/');    
      } else {
        if (room) {
          AddUserToRoom(req.user, room, res, function(updatedRoom) {
            if (updatedRoom) {
              console.log(updatedRoom);           
              io.to(updatedRoom.roomNumber).emit(SocketEvent.SERVER_BROADCASTROOMUPDATE, updatedRoom);
            }
          });
        } else {
          console.log('could not join room ' + roomNumber + ' since it could not be found');
          res.redirect('/');      
        }
      }
    });
});

app.get('/api/room', (req, res) => {
  Room.findOne({ roomNumber: req.query.id }, (err, room) => {
    var jsonRes = {
      success: false,
    };
    if (err) {
      console.log('error processing GET /api/room/' + req.query);
    } else {
      if (room) {
        jsonRes = {
          success: true,
          roomNumber: room.roomNumber,
          userCount: room.users.length,
        };
      } else {
        console.log('could not find room ' + req.query.id);
      }
    }

    console.log(jsonRes);
    res.json(jsonRes);
  });
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


// SOCKETS
// ===========================================================================
var serve = http.createServer(app);
var io = socketServer(serve);
const PORT = 3000;

serve.listen(PORT, ()=> {console.log("Server running, listening on port " + PORT)});

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

  socket.on(SocketEvent.USER_JOINROOM, (roomNumber) => {
    socket.join(roomNumber);
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

  socket.on('disconnect', (reason) => {
    console.log('client disconnected');
    console.log(reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('client reconnected');
    console.log(attemptNumber);
  });
});
