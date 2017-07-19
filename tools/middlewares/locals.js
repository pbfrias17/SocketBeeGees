/* Collection of middleware functions used to 
*  localize data for view templates and other
*  use-cases
*/

import request from 'request';
import consume from 'consume-http-header';
import Room from '../../models/room';

const importUser = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

const importRoom = (req, res, next) => {
  if (req.method === 'GET') {
    Room.findOne({ roomNumber: req.params.roomNumber }).
      populate('users').exec((err, room) => {
        if (err) {
          console.log('ERR on importRoom.populate()');
        } else {
          console.log('room ' + room.roomNumber + ' was imported');
          res.locals.room = room;
        }

        next();
      });
  } else {
    next();
  }
};

export { importUser, importRoom };