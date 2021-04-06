type Action = {
    type: any;
    payload: any;
};

type UserReducerType = {
    userData: any,
    userDataFetching: boolean,
    enterpriseData: any,
    enterpriseUserData: any,
    enterpriseUserDataFetching: boolean,
    enterpriseParkingSpotData: any,
    enterpriseParkingSpotDataFetching: boolean,
    error: any,
};

const initialState: UserReducerType = {
    userData: {},
    userDataFetching: false,
    enterpriseData: {},
    enterpriseUserData: {}, // API.Models.EnterpriseUserDataResponse
    enterpriseUserDataFetching: false,
    enterpriseParkingSpotData: {},
    enterpriseParkingSpotDataFetching: false,
    error: {}
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
                error: action.payload,
                userDataFetching: false
            }
        }
        case "ADD_ENTERPRISE_DATA": {
            return {
                ...state,
                enterpriseData: action.payload
            }
        }
        case "FETCH_ENTERPRISE_USER_DATA_START": {
            return {
                ...state,
                enterpriseUserDataFetching: true
            }
        }
        case "FETCH_ENTERPRISE_USER_DATA_SUCCESS": {
            return {
                ...state,
                enterpriseUserData: action.payload,
                enterpriseUserDataFetching: false
            }
        }
        case "FETCH_ENTERPRISE_USER_DATA_ERROR": {
            return {
                ...state,
                error: action.payload,
                enterpriseUserDataFetching: false
            }
        }
        case "FETCH_ENTERPRISE_PARKINGSPOT_DATA_START": {
            return {
                ...state,
                enterpriseParkingSpotDataFetching: true
            }
        }
        case "FETCH_ENTERPRISE_PARKINGSPOT_DATA_SUCCESS": {
            return {
                ...state,
                enterpriseParkingSpotData: action.payload,
                enterpriseParkingSpotDataFetching: false
            }
        }
        case "FETCH_ENTERPRISE_PARKINGSPOT_DATA_ERROR": {
            return {
                ...state,
                error: action.payload,
                enterpriseParkingSpotDataFetching: false
            }
        }
        default:
            return state;
    }
};