import mongoose from 'mongoose';
import passport from 'passport';
import Room from '../models/room';
import User from '../models/user';

/* local data */
const roomData = [
  {
    roomNumber: 123,
    users: []
  },
];

const testUser = {
  username: 'p1',
  password: '123',
  roomNumber: 123,
};

const testUser1 = {
  username: 'p2',
  password: '123',
  roomNumber: 123
};

const usersToAdd = [testUser, testUser1];

export default function seedDB() {
  Room.remove({}, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('wiped db.Room');
      
      // Initialize new rooms
      roomData.forEach(function(room) {
        Room.create(room, function(err, roomCreated) {
          if(err) {
            console.log('ERR on room.create()');
          } else {
            console.log('added room #' + room.roomNumber);
            User.remove({}, (err) => {
              if(err) {
                console.log(err);
              }
                console.log('wiped db.User');
                
                // Register/create users after rooms
                for (let userToAdd of usersToAdd) {
                  User.register(userToAdd, userToAdd.password, (err, newUser) => {
                    if (err) {
                      console.log('ERR on user.create()');
                    } else {
                      console.log('added user ' + newUser.username);
                      Room.findOne({ roomNumber: newUser.roomNumber }, (err, foundRoom) => {
                        if (err) {
                          console.log('ERR on room.findOne()');
                        } else {
                          if (foundRoom !== null) {
                            foundRoom.users.push(newUser);
                            foundRoom.save((err, data) => {
                              if (err)
                                console.log('ERR on foundRoom.save()');
                              else
                                console.log('added user ' + newUser.username + ' to room ' + foundRoom.roomNumber);
                            });
                          } else {
                            console.log('could not find room ' + newUser.roomNumber);
                          }
                        }
                      });
                    }
                  });
                }
            });
          }
        }
      );
    }
    );
    }
  });
};