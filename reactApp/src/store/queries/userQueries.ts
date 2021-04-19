import { apiUrl } from '../../_helpers/apiUrl';
import { get, post } from '../../_helpers/fetch-wrapper';
import { FETCH_USER_DATA_START, FETCH_USER_DATA_SUCCESS } from '../actions/userActions';
import { AuthenticateRequest } from '../types/authenticateRequest';
import { RegisterUser } from '../types/userType';


export const login = async (request: AuthenticateRequest) => {
    return await post(`${apiUrl}/api/accounts/authenticate`, request);
}

export const getEmails = async() =>{
    return await get(`${apiUrl}/api/accounts/emails`)
}

export const getUserData = async (dispatch: any) => {
    dispatch(FETCH_USER_DATA_START())
    return await get(`${apiUrl}/api/accounts/data`).then((data) => dispatch(FETCH_USER_DATA_SUCCESS(data)))
}
export const getUserCarsData = async (dispatch: any) => {
    return await get(`${apiUrl}/api/accounts/cars`)
}

export const addUser = async (registerUser : RegisterUser) => {
    return await post(`${apiUrl}/api/accounts/register`,registerUser)
}
