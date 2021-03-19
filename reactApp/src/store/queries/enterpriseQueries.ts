import axios from "axios"
import { apiUrl } from "../../_helpers/apiUrl"
import { get } from "../../_helpers/fetch-wrapper"
import { FETCH_ENTERPRISE_USER_DATA_ERROR, FETCH_ENTERPRISE_USER_DATA_START, FETCH_ENTERPRISE_USER_DATA_SUCCESS } from "../actions/enterpriseActions"
import { Reservation, ReservationRequest } from "../types/enterpriseTypes"

export const getEnterpriseUserData = async (enterpriseId: number, dispatch: any) => {
    dispatch(FETCH_ENTERPRISE_USER_DATA_START())
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/user`).then(data => dispatch(FETCH_ENTERPRISE_USER_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_ENTERPRISE_USER_DATA_ERROR(err)))
}

export const addReservation = async (reservation: ReservationRequest) => {
    reservation.startDate = new Date(Date.UTC(reservation.startDate.getFullYear(), reservation.startDate.getMonth(), reservation.startDate.getDate(), reservation.startDate.getHours(), reservation.startDate.getMinutes()))
    reservation.endDate =  new Date(Date.UTC(reservation.endDate.getFullYear(), reservation.endDate.getMonth(), reservation.endDate.getDate(), reservation.endDate.getHours(), reservation.endDate.getMinutes()))
    return await postReservation(reservation);
};

const postReservation = (reservation: ReservationRequest) => {
    return axios.post(`${apiUrl}/api/enterprises/reservation`, JSON.stringify(reservation), {headers: {"Content-Type": "application/json"}});
};

export const getAccountsWithoutSpot = async (enterpriseId: number) => {
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/users`)
}

export const cancelSpotRelease = async (data: any) => {
    return "canceled";
}