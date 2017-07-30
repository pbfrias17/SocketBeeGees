import request from 'request';
import consume from 'consume-http-header';
import Room from '../../models/room';

const importUser = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

const verifyRoomAccessForUser = (req, res, next) => {
  var { user } = req;
  if (user) {
    Room.findOne({ roomNumber: req.query.id }).
      populate('users').exec((err, room) => {
        var accessGranted = false;
        if (err) {
          console.log('ERR on importRoom.populate()');
        } else if (room === null) {
          console.log('room ' + req.query.id + ' was not found');
        } else {
          const userInRoom = room.users.find(function(u) { return u.username === user.username; });
          console.log('found user(' + userInRoom + ') in room ' + room.roomNumber + ' ');
          accessGranted = userInRoom !== undefined;
        }

        res.locals.userVerifiedForRoomAccess = accessGranted;
        res.locals.room = room;

        next();
      });
  } else {
    console.log('user is not logged in for room access');
    next();
  }
};

export { importUser, verifyRoomAccessForUser };