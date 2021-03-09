type Action = {
    type: any;
    payload: any;
};

type UserReducerType = {
    userData: any,
    enterpriseData: any,
    enterpriseUserData: any,
    enterpriseUserDataFetching: boolean,
    error: any,
};

const initialState: UserReducerType = {
    userData: {},
    enterpriseData: {},
    enterpriseUserDataFetching: false,
    enterpriseUserData: {}, // API.Models.EnterpriseUserDataResponse
    error: {}
};

export const userReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "ADD_USER_DATA": {
            return {
                ...state,
                userData: action.payload
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
        default:
            return state;
    }
};