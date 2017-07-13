import * as ActionType from '../actions/types';

let id = 0;
const initialState = { 
  roomNumber: -1,
  users: [],
};

const roomReducer = (state=initialState, action) => {
  switch (action.type) {
    case ActionType.USER_JOINROOM:
      return {
        roomNumber: action.payload.roomNumber,
        users: state.users.push(action.payload)
      };

    case ActionType.USER_SETROOMINFO:
      return action.payload;

    default:
      return state;
  };
};


export default roomReducer;
