// import { Reservation } from "../types/reservationType";

import { User } from "../types/userType";

type Action = {
    type: any;
    payload: any;
};

type UserReducerType = {
    userData: any,
    enterpriseData: any
    error: any,
};

const initialState: UserReducerType = {
    userData: {},
    enterpriseData: {},
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
