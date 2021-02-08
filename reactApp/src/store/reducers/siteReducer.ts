import { SiteAlert } from "../types/siteTypes";

type Action = {
    type: any;
    payload: any;
};

type SiteReducerType = {
    successAlert: SiteAlert,
    errorAlert: SiteAlert,
    errorAlerts: SiteAlert[]
};

const initialState: SiteReducerType = {
    successAlert: {status: false, message: ""},
    errorAlert: {status: false, message: ""},
    errorAlerts: []
};

export const siteReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "SET_SUCCESS_ALERT": {
            return {
                ...state,
                successAlert: action.payload,
                errorAlert: {status: false, message: ""}
            }
        }
        case "SET_ERROR_ALERT": {
            return {
                ...state,
                errorAlert: action.payload,
                successAlert: {status: false, message: ""}
            }
        }
        default:
            return state;
    }
};