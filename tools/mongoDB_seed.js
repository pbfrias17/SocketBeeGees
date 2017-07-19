import mongoose from 'mongoose';
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
  username: 'TestUser',
  password: 'whocares',
  roomNumber: 123,
};

export default function seedDB() {
  Room.remove({}, function(err) {
    if(err) {
      console.log(err);
    }
      console.log('wiped db.Room');
    
      // seed with new data
      roomData.forEach(function(room) {
      Room.create(room, function(err, roomCreated) {
        if(err) {
          console.log('ERR on room.create()');
        } else {
          console.log('added room #' + room.roomNumber);
        }
      });
    });
  });

  User.remove({}, (err) => {
    if(err) {
      console.log(err);
    }
      console.log('wiped db.User');
      
      User.create(testUser, (err, newUser) => {
        if (err) {
          console.log('ERR on user.create()');
        } else {
          console.log('added user ' + newUser.username);
          Room.findOne({ roomNumber: newUser.roomNumber }, (err, foundRoom) => {
            if (err) {
              console.log('ERR on room.findOne()');
            } else {
              if (foundRoom !== null) {
                console.log('found room ' + foundRoom.roomNumber);
                foundRoom.users.push(newUser);
                foundRoom.save((err, data) => {
                  if (err)
                    console.log('ERR on foundRoom.save()');
                  else
                    console.log('yey saved room');
                });
              } else {
                console.log('could not find room');
              }
            }
          });
        }
      });
  });
};