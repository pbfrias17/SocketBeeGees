import * as ActionType from './types';

const UpdateUser = (user) => {
  console.log('UpdateUser() action received user ' + user);
  return {
    type: ActionType.USER_UPDATE,
    payload: user
  };
};

const SetUserInfo = (user) => {
  return {
    type: ActionType.USER_SETUSERINFO,
    payload: user
  }
};

const SetRoomInfo = (room) => {
  return {
    type: ActionType.USER_SETROOMINFO,
    payload: room
  };
};

export { UpdateUser, SetRoomInfo };