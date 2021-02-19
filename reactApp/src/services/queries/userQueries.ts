import axios from 'axios';
import { apiUrl } from '../apiUrl';
import { handleErrors } from '../../components/common/handleError';
import {
    FETCH_ALL_USERS_ERROR, FETCH_ALL_USERS_START, FETCH_ALL_USERS_SUCCESS,

    FETCH_PARKINGSPACEMAINUSERS_DATA_ERROR,

    FETCH_PARKINGSPACEMAINUSERS_DATA_START,

    FETCH_PARKINGSPACEMAINUSERS_DATA_SUCCESS,

    FETCH_REGULARUSERS_DATA_ERROR, FETCH_REGULARUSERS_DATA_START, FETCH_REGULARUSERS_DATA_SUCCESS, FETCH_USER_DATA_ERROR, FETCH_USER_DATA_START, FETCH_USER_DATA_SUCCESS, FETCH_USER_SPECIFIC_DATA_ERROR, FETCH_USER_SPECIFIC_DATA_START, FETCH_USER_SPECIFIC_DATA_SUCCESS,
} from '../../store/actions/userActions';
import { AuthenticateRequest } from '../../store/types/authenticateRequest';
import AuthorizationHeader from '../header';


// TEMPORARY LOGIN
export const getUserData = async (email: any) => {
    const data = await axios.get(`${apiUrl}/api/users/login/${email}`);
    return data.data;
};

export const authenticateUser = async (request: AuthenticateRequest) => {
    const data = await axios.post(`${apiUrl}/api/accounts/authenticate`, JSON.stringify(request), {headers: {"Content-Type": "application/json"}});
    return data.data;
}

export const getUser = (userId:any, dispatch: any) => {
    dispatch(FETCH_USER_DATA_START());
    fetch(`${apiUrl}/api/users/login/${userId}`, {headers: AuthorizationHeader()}).then(response => handleErrors(response)).then(response => response.json()).then(data => dispatch(FETCH_USER_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_USER_DATA_ERROR(err)));
}

export const getSpecificUser = async (userId:any, dispatch: any) => {
    dispatch(FETCH_USER_SPECIFIC_DATA_START());
    await fetch(`${apiUrl}/api/users/${userId}`).then(response => handleErrors(response)).then(response => response.json()).then(data => dispatch(FETCH_USER_SPECIFIC_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_USER_SPECIFIC_DATA_ERROR(err)));
}
export const getSpecific = async (userId: any) => {
    var data = await axios.get(`${apiUrl}/api/users/${userId}`);
    return data;
};

export const getAllUsers = (dispatch: any) => {
    dispatch(FETCH_ALL_USERS_START());
    fetch(`${apiUrl}/api/users`).then(response => handleErrors(response)).then(response => response.json()).then(data => dispatch(FETCH_ALL_USERS_SUCCESS(data))).catch(err => dispatch(FETCH_ALL_USERS_ERROR(err)));
}

export const getAllUsersAxios = async () => {
    var data = await axios.get(`${apiUrl}/api/users`);
    return data;
}

export const getRegularUsers = (dispatch: any) => {
    dispatch(FETCH_REGULARUSERS_DATA_START());
    fetch(`${apiUrl}/api/users/regularusers`).then(response => handleErrors(response)).then(response => response.json()).then(data => dispatch(FETCH_REGULARUSERS_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_REGULARUSERS_DATA_ERROR(err)));
}



export const getParkingSpaceMainUsers = (dispatch: any) => {
    dispatch(FETCH_PARKINGSPACEMAINUSERS_DATA_START());
    fetch(`${apiUrl}/parkingspacefulldata`).then(response => handleErrors(response)).then(response => response.json()).then(data => dispatch(FETCH_PARKINGSPACEMAINUSERS_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_PARKINGSPACEMAINUSERS_DATA_ERROR(err)));
}


export const getParkingSpaceMainUsersAxios = async () => {
    var data = await axios.get(`${apiUrl}/parkingspacefulldata`);
    return data;
}





export const getRegularUsersAxios = async () => {
    var data = await axios.get(`${apiUrl}/api/users/regularusers`);
    return data;
}

export const deleteUserById = async (userId: any, whoDeleted: any) => {
    return axios.delete(`${apiUrl}/api/users/${userId}/${whoDeleted}`);
};

export const checkRole = async (userId: any) => {
    const data = await axios.get(`${apiUrl}/api/auth/authenticate/${userId}`)

    return data.data;
}

export const checkSession = async () => {
    var data = await axios.get(`${apiUrl}/api/auth/session`, {headers: AuthorizationHeader()});
    return data;
}