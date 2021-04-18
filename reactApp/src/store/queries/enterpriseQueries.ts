import axios from "axios"
import { apiUrl } from "../../_helpers/apiUrl"
import { authHeader, del, get, post } from "../../_helpers/fetch-wrapper"
import { ADD_ENTERPRISE_DATA, FETCH_ENTERPRISE_PARKINGSPOT_DATA_ERROR, FETCH_ENTERPRISE_PARKINGSPOT_DATA_START, FETCH_ENTERPRISE_PARKINGSPOT_DATA_SUCCESS, FETCH_ENTERPRISE_USER_DATA_ERROR, FETCH_ENTERPRISE_USER_DATA_START, FETCH_ENTERPRISE_USER_DATA_SUCCESS } from "../actions/enterpriseActions"
import { ParkingSpotMainUserRequest, ParkingSpotRequest, ReleaseRequest, ReservationRequest } from "../types/enterpriseTypes"

export const getUserEnterprises = async () => {
    return await get(`${apiUrl}/api/enterprises/user`)
}

export const getEnterprise = async (id: any, dispatch: any) => {
    return await get(`${apiUrl}/api/enterprises/${id}`).then(data => dispatch(ADD_ENTERPRISE_DATA(data))).catch(data => localStorage.removeItem("enterprise"));
}

export const getEnterpriseUserData = async (enterpriseId: number, dispatch: any, fetchStart: boolean) => {
    if(enterpriseId === 0) { return null }
    if(fetchStart === true) { dispatch(FETCH_ENTERPRISE_USER_DATA_START()) }
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

export const getEnterpriseParkingSpotData = async (enterpriseId: number, dispatch: any, fetchStart: boolean) => {
    if(enterpriseId === 0) { return null }
    if(fetchStart === true) { dispatch(FETCH_ENTERPRISE_PARKINGSPOT_DATA_START()) }
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/spot`).then(data => dispatch(FETCH_ENTERPRISE_PARKINGSPOT_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_ENTERPRISE_PARKINGSPOT_DATA_ERROR(err)))
}

export const releaseParkingSpot = (request: ReleaseRequest) => {
    return post(`${apiUrl}/api/enterprises/release`, request)
}

export const getAvailableSpotsForReservation = async (startDate: Date, endDate: Date, enterpriseId: number) => {
    return await post(`${apiUrl}/api/enterprises/${enterpriseId}/available-dates`, {startDate, endDate})
}

// ADMIN QUERIES

export const getEnterpriseUsers = async (enterpriseId: number) => {
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/admin/users`)
}

export const getEnterpriseParkingSpots = async (enterpriseId: number) => {
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/admin/parkingspots`)
}

export const getParkingSpotMainUsers = async (enterpriseId: number) => {
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/admin/parkingspots/mainusers`)
}

export const addParkingSpotPlan = async (formData:FormData, enterpriseId: number) => {
    return await axios.post(`${apiUrl}/api/enterprises/${enterpriseId}/admin/addparkinglotplan`, formData, {headers: {"Content-Type": "multipart/form-data", ...authHeader()}} )
}

export const addParkingSpotMainUser = (request: ParkingSpotMainUserRequest, enterpriseId: number) => {
    return post(`${apiUrl}/api/enterprises/${enterpriseId}/admin/parkingspots/adduser`, request)
}

export const changeCanBook = async (entepriseId: number, accountId: number) => {
    return await axios.post(`${apiUrl}/api/enterprises/${entepriseId}/admin/parkingspots/mainusers/${accountId}/canBook`,null,  {headers: {"Content-Type": "application/json",...authHeader()}} )
}

export const deleteParkingSpotMainUser = async (entepriseId: number, accountId: number, parkingSpotId: number) => {
    return await axios.post(`${apiUrl}/api/enterprises/${entepriseId}/admin/parkingspots/${parkingSpotId}/user/${accountId}/delete`,null,  {headers: {"Content-Type": "application/json",...authHeader()}} )
}

export const addParkingSpot = (request: ParkingSpotRequest, enterpriseId: number) => {
    return postParkingSpot(request, enterpriseId);
};

const postParkingSpot = (parkingSpot: ParkingSpotRequest, enterpriseId : number) => {
    return axios.post(`${apiUrl}/api/enterprises/${enterpriseId}/admin/parkingspots/add`, JSON.stringify(parkingSpot), {headers: {"Content-Type": "application/json", ...authHeader()}});
};

export const deleteParkingSpot = (parkingSpotId: number, enterpriseId : number) => {
    if(parkingSpotId !== undefined){
        return del(`${apiUrl}/api/enterprises/${enterpriseId}/admin/parkingspots/${parkingSpotId}/delete`)
    }
}

