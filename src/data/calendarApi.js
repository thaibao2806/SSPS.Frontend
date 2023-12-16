import axios from "axios"


const createMoneyPlan = (type, expectAmount, currencyUnit, dateTime, usageMoneys, accessToken) => {
    return axios.post("http://localhost:5031/api/user/money-plan", {type, expectAmount, currencyUnit, dateTime, usageMoneys}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getMoneyPlanById = (id, accessToken) => {
    return axios.get(`http://localhost:5031/api/user/money-plan/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getMoneyPlanRangeType = (type, fromDate, toDate, accessToken) => {
    return axios.get(`http://localhost:5031/api/user/money-plan/range-type?Type=${type}&FromDate=${fromDate}&ToDate=${toDate}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const updateMoneyPlan = (id, type, status, day, month, year, expectAmount,actualAmount, currencyUnit, usages, accessToken) => {
    return axios.post("http://localhost:5031/api/user/money-plan/update-money-plan", {id, type,status, day, month, year, expectAmount, actualAmount, currencyUnit,  usages}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const deletePlan = (moneyPlanId,accessToken ) => {
    return axios.post(`http://localhost:5031/api/user/money-plan/delete-money-plan?MoneyPlanId=${moneyPlanId}`,null, {
        headers: {
        Authorization: `Bearer ${accessToken}`
    }
    })
}

const updateUsage = (moneyPlanId, data, accessToken) => {
    return axios.post("http://localhost:5031/api/user/money-plan/update-usage-money-plan", {moneyPlanId, data}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
} 

const getCategories = (accessToken) => {
    return axios.get("http://localhost:5031/api/user/category", {headers: {
        Authorization: `Bearer ${accessToken}`
    }})
}

const updateCategories = (categories, accessToken) => {
    return axios.post("http://localhost:5031/api/user/update-category", {categories}, {
        headers: { Authorization: `Bearer ${accessToken}`}
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
    updateCategories
}