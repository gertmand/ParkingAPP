// import { Reservation } from "../types/reservationType";
import { ParkingSpaceMainUser, RegularUser, User } from "../types/userType";

type Action = {
    type: any;
    payload: any;
};

type UserReducerType = {
    userFetchError: boolean,
    specificUserFetchError: boolean,
    allUsers: User[],
    regularUsers: RegularUser[],
    parkingSpaceMainUsers: ParkingSpaceMainUser[],
    userData: any,
    userAdmin: boolean,
    specificUserData: any,
    userDataFetching: boolean,
    specificUserDataFetching: boolean,
    allUsersFetching: boolean,
    regularUsersFetching: boolean,
    parkingSpaceMainUsersFetching: boolean,
    reservationQuery: boolean,
    //userReservations: Reservation[],
    error: any,
    buttonText : boolean,
};

const initialState: UserReducerType = {
    userFetchError: false,
    specificUserFetchError: false,
    allUsers: [],
    regularUsers: [],
    parkingSpaceMainUsers: [],
    userData: [],
    userAdmin: false,
    specificUserData: [],
    userDataFetching: false,
    specificUserDataFetching: false,
    allUsersFetching: false,
    regularUsersFetching: false,
    parkingSpaceMainUsersFetching:false,
    reservationQuery: false,
    //userReservations: [],
    error: "",
    buttonText: false
};

export const userReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "FETCH_USER_DATA_START": {
            return {
                ...state,
                userDataFetching: true
            }
        }
        case "FETCH_USER_DATA_SUCCESS": {
            return {
                ...state,
                userData: action.payload,
                userDataFetching: false
            }
        }
        case "FETCH_USER_DATA_ERROR": {
            return {
                ...state,
                userDataFetching: false,
                userFetchError: true,
                error: action.payload
            }
        }
        case "FETCH_USER_SPECIFIC_DATA_START": {
            return {
                ...state,
                specificUserDataFetching: true
            }
        }
        case "FETCH_USER_SPECIFIC_DATA_SUCCESS": {
            return {
                ...state,
                specificUserData: action.payload,
                specificUserDataFetching: false
            }
        }
        case "FETCH_USER_SPECIFIC_DATA_ERROR": {
            return {
                ...state,
                specificUserDataFetching: false,
                specificUserFetchError: true,
                error: action.payload
            }
        }
        case "FETCH_ALL_USERS_START": {
            return {
                ...state,
                allUsersFetching: true
            }
        }
        case "FETCH_ALL_USERS_SUCCESS": {
            return {
                ...state,
                allUsers: action.payload,
                allUsersFetching: false
            }
        }
        case "FETCH_ALL_USERS_ERROR": {
            return {
                ...state,
                allUsersFetching: false,
                error: action.payload
            }
        }
        case "FETCH_REGULARUSERS_DATA_START": {
            return {
                ...state,
                regularUsersFetching: true
            }
        }
        case "FETCH_REGULARUSERS_DATA_SUCCESS": {
            return {
                ...state,
                regularUsers: action.payload,
                regularUsersFetching: false
            }
        }
        case "FETCH_REGULARUSERS_DATA_ERROR": {
            return {
                ...state,
                regularUsersFetching: false,
                error: action.payload
            }
        }


        case "FETCH_PARKINGSPACEMAINUSERS_DATA_START": {
            return {
                ...state,
                parkingSpaceMainUsersFetching: true
            }
        }
        case "FETCH_PARKINGSPACEMAINUSERS_DATA_SUCCESS": {
            return {
                ...state,
                parkingSpaceMainUsers: action.payload,
                parkingSpaceMainUsersFetching: false
            }
        }
        case "FETCH_PARKINGSPACEMAINUSERS_DATA_ERROR": {
            return {
                ...state,
                parkingSpaceMainUsersFetching: false,
                error: action.payload
            }
        }



        case "FETCH_USER_RESERVATIONS_START": {
            return {
                ...state,
                reservationQuery: true
            }
        }
        case "FETCH_USER_RESERVATIONS_SUCCESS": {
            return {
                ...state,
                userReservations: action.payload,
                reservationQuery: false
            }
        }
        case "FETCH_USER_RESERVATIONS_ERROR": {
            return {
                ...state,
                reservationQuery: false,
                error: action.payload
            }
        }
        case "SET_BUTTON_TEXT": {
            return {
                ...state,
                buttonText: action.payload
            }
        }
        case "SET_ADMIN": {
            return {
                ...state,
                userAdmin: action.payload
            }
        }
        default:
            return state;
    }
};
