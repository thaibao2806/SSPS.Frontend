import axios from "axios"
import { getReportUser, url } from "../config"

export const reportMoneyPlan = (Type, FromDate, ToDate, accessToken) => {
    return axios.get(url + getReportUser + `?Type=${Type}&FromDate=${FromDate}&ToDate=${ToDate}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}