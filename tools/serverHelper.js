import User from '../models/user';
import Room from '../models/room';

function AddUserToRoom(user, room, res, joinCallback = undefined) {
  room.users.push(user._id);
  room.save((err, data) => {
    if (err) {
      console.log('ERR on room.save()');
      res.redirect('/');
    } else {
      console.log('saved newly created room');
      User.findById(user._id, (err, foundUser) => {
        if (err) {
          console.log('ERR on user.findById()');
          res.redirect('/');
        } else {
          if (foundUser) {
            foundUser.roomNumber = room.roomNumber;
            foundUser.save((err, data) => {
              if (err) {
                console.log('ERR on user save new roomNumber');
                res.redirect('/');
              } else {
                if (joinCallback) {
                  Room.findOne({ roomNumber: foundUser.roomNumber }).
                    populate('users').
                    exec((err, updatedRoom) => {
                      if (err) {
                        console.log('ERR on room.find.populate(users)');
                        res.redirect('/');
                      } else {
                        if (updatedRoom) {
                          joinCallback(updatedRoom);
                          res.redirect('/room?id=' + updatedRoom.roomNumber);
                        } else {
                          console.log('could not find room ' + updatedRoom.roomNumber);
                          res.redirect('/');
                        }
                      }
                    });
                } else {
                  res.redirect('/room?id=' + data.roomNumber);
                }
              }
            });
          } else {
            console.log('Could not find user by id');
            res.redirect('/');
          }
        }
      });
    }
  });
}

export { AddUserToRoom };