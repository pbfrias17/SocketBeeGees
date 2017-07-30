import * as ActionType from '../actions/types';

let id = 0;
const initialState = {};

const userReducer = (state=initialState, action) => {
  switch (action.type) {
    case ActionType.USER_UPDATE:
      return action.payload;

    case ActionType.USER_SETUSERINFO:
      return { ...action.payload };

    default:
      return state;
  };
};

export default userReducer;
