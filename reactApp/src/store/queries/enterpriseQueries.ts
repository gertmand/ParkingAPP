import { apiUrl } from "../../_helpers/apiUrl"
import { get } from "../../_helpers/fetch-wrapper"
import { FETCH_ENTERPRISE_USER_DATA_ERROR, FETCH_ENTERPRISE_USER_DATA_START, FETCH_ENTERPRISE_USER_DATA_SUCCESS } from "../actions/enterpriseActions"

export const getEnterpriseUserData = async (enterpriseId: number, dispatch: any) => {
    dispatch(FETCH_ENTERPRISE_USER_DATA_START())
    return await get(`${apiUrl}/api/enterprises/${enterpriseId}/user`).then(data => dispatch(FETCH_ENTERPRISE_USER_DATA_SUCCESS(data))).catch(err => dispatch(FETCH_ENTERPRISE_USER_DATA_ERROR(err)))
}