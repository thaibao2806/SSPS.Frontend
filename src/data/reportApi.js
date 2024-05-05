import axios from "axios"
import { getReportUser, url } from "../config"

export const reportMoneyPlan = (Type, FromDate, ToDate, accessToken, axiosJWT) => {
    return axiosJWT.get(url + getReportUser + `?Type=${Type}&FromDate=${FromDate}&ToDate=${ToDate}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}