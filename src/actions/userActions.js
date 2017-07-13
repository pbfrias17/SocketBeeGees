import * as ActionType from './types';

const AddUser = (user) => {
    return {
        type: ActionType.USER_JOINROOM,
        payload: {
            userId,
            pin,
            currentSocket,
            currentRoom,
        }
    };
};

export { AddUser };