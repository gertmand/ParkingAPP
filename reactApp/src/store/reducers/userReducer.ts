// import { Reservation } from "../types/reservationType";

type Action = {
    type: any;
    payload: any;
};

type UserReducerType = {
    userData: any,
    error: any,
};

const initialState: UserReducerType = {
    userData: {},
    error: false
};

export const userReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "ADD_USER_DATA": {
            return {
                ...state,
                userData: action.payload
            }
        }
        default:
            return state;
    }
};
