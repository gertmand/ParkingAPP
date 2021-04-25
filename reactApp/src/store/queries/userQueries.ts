import { apiUrl } from '../../_helpers/apiUrl';
import { get, post } from '../../_helpers/fetch-wrapper';
import { FETCH_USER_DATA_START, FETCH_USER_DATA_SUCCESS } from '../actions/userActions';
import { AuthenticateRequest } from '../types/authenticateRequest';
import { Car, RegisterUser } from '../types/userType';


export const login = async (request: AuthenticateRequest) => {
    return await post(`${apiUrl}/api/accounts/authenticate`, request);
}

export const checkExistingEmail = async(email :String) =>{
    return await post(`${apiUrl}/api/accounts/check-existing-email`, email)
}

export const getUserData = async (dispatch: any, fetchStart: boolean = true) => {
    if(fetchStart === true) { dispatch(FETCH_USER_DATA_START()) }
    return await get(`${apiUrl}/api/accounts/data`).then((data) => dispatch(FETCH_USER_DATA_SUCCESS(data)))
}
export const getUserCarsData = async (dispatch: any) => {
    return await get(`${apiUrl}/api/accounts/cars`)
}

export const addUser = async (registerUser : RegisterUser) => {
    return await post(`${apiUrl}/api/accounts/register`,registerUser)
}

export const addCar = async (car : any) => {
    return await post(`${apiUrl}/api/accounts/add-car`, car)
}

export const deleteCar = async (car : any) => {
    return await post(`${apiUrl}/api/accounts/delete-car`, car)
}
