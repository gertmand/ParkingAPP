export const FETCH_USER_DATA_START = () => ({
    type: "FETCH_USER_DATA_START"
})

export const FETCH_USER_DATA_SUCCESS = (payload: any) => ({
    type: "FETCH_USER_DATA_SUCCESS",
    payload: payload
});

export const FETCH_USER_DATA_ERROR = (payload: any) => ({
    type: "FETCH_USER_DATA_ERROR",
    payload: payload
});