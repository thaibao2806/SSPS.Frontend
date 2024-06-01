import axios from "axios"
import { createListPlan, createMoneyPlans, deleteCategory, deleteMoneyPlan, getCategory, getMoneyPlanId, getMoneyPlanRange, updateCategory, updateMoneyPlans, updateUsageMoney, url } from "../config"


const createMoneyPlan = (type, expectAmount, currencyUnit, dateTime, usageMoneys, accessToken, axiosJWT) => {
    return axiosJWT.post( url + createMoneyPlans, {type, expectAmount, currencyUnit, dateTime, usageMoneys}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const getMoneyPlanById = (id, accessToken) => {
    return axios.get( url + getMoneyPlanId +`${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const getMoneyPlanRangeType = (type, fromDate, toDate, accessToken, axiosJWT) => {
    return axiosJWT.get(url + getMoneyPlanRange + `?Type=${type}&FromDate=${fromDate}&ToDate=${toDate}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const updateMoneyPlan = (id, type, status, day, month, year, expectAmount,actualAmount, currencyUnit, usages, accessToken,axiosJWT) => {
    return axiosJWT.post( url + updateMoneyPlans, {id, type,status, day, month, year, expectAmount, actualAmount, currencyUnit,  usages}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const deletePlan = (moneyPlanId,accessToken, axiosJWT ) => {
    return axiosJWT.post( url + deleteMoneyPlan + `?MoneyPlanId=${moneyPlanId}`,null, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420"
    }
    })
}

const updateUsage = (moneyPlanId, data, accessToken, axiosJWT) => {
    return axiosJWT.post( url + updateUsageMoney, {moneyPlanId, data}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
} 

const getCategories = (accessToken, axiosJWT) => {
    return axiosJWT.get( url + getCategory, {headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420"
    }})
}

const updateCategories = (categories, accessToken, axiosJWT) => {
    return axiosJWT.post( url + updateCategory, {categories}, {
        headers: { Authorization: `Bearer ${accessToken}`,
    "ngrok-skip-browser-warning": "69420"}
    })
}

const deleteCategories = (id, accessToken, axiosJWT) => {
    return axiosJWT.post( url + deleteCategory, {id}, {
        headers: { Authorization: `Bearer ${accessToken}`,
    "ngrok-skip-browser-warning": "69420"}
    })
}

const createListMoneyPlan = (expectAmount, currencyUnit, fromDate, toDate, usageMoneys, accessToken, axiosJWT) => {
    return axiosJWT.post( url + createListPlan, {expectAmount, currencyUnit, fromDate, toDate, usageMoneys}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}


export {
    createMoneyPlan,
    getMoneyPlanById,
    getMoneyPlanRangeType,
    updateMoneyPlan,
    deletePlan,
    updateUsage,
    getCategories,
    updateCategories,
    deleteCategories,
    createListMoneyPlan
}