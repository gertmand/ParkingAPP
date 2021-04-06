import { apiUrl } from '../../_helpers/apiUrl';
import { get, post } from '../../_helpers/fetch-wrapper';
import { FETCH_USER_DATA_START, FETCH_USER_DATA_SUCCESS } from '../actions/userActions';
import { AuthenticateRequest } from '../types/authenticateRequest';


export const login = async (request: AuthenticateRequest) => {
    return await post(`${apiUrl}/api/accounts/authenticate`, request);
}

export const getUserData = async (dispatch: any) => {
    dispatch(FETCH_USER_DATA_START())
    return await get(`${apiUrl}/api/accounts/data`).then((data) => dispatch(FETCH_USER_DATA_SUCCESS(data)))
}