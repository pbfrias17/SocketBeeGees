import * as ActionType from './types';

const AddUser = (user) => {
  return {
    type: ActionType.USER_JOINROOM,
    payload: user
  };
};

const SetRoomInfo = (room) => {
  return {
    type: ActionType.USER_SETROOMINFO,
    payload: room
  };
};

export { AddUser, SetRoomInfo };