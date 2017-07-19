import * as ActionType from '../actions/types';

let id = 0;
const initialState = { 
  users: [],
};

const roomReducer = (state=initialState, action) => {
  switch (action.type) {

    case ActionType.USER_SETROOMINFO:
      return action.payload;

    default:
      return state;
  };
};


export default roomReducer;
