import axios from 'axios';
import { apiUrl } from '../../_helpers/apiUrl';
import { post, get } from '../../_helpers/fetch-wrapper';
import { AuthenticateRequest } from '../types/authenticateRequest';


export const login = async (request: AuthenticateRequest) => {
    return await post(`${apiUrl}/api/accounts/authenticate`, request);
}

export const getUserData = async () => {
    return await get(`${apiUrl}/api/accounts/data`)
}