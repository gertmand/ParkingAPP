export const ADD_ENTERPRISE_DATA = (payload: any) => ({
    type: "ADD_ENTERPRISE_DATA",
    payload: payload
});

export const FETCH_ENTERPRISE_USER_DATA_START = () => ({
    type: "FETCH_ENTERPRISE_USER_DATA_START",
});

export const FETCH_ENTERPRISE_USER_DATA_SUCCESS = (payload: any) => ({
    type: "FETCH_ENTERPRISE_USER_DATA_SUCCESS",
    payload: payload
});

export const FETCH_ENTERPRISE_USER_DATA_ERROR = (payload: any) => ({
    type: "FETCH_ENTERPRISE_USER_DATA_ERROR",
    payload: payload
});