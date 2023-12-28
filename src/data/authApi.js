import axios from "axios"
const getUserByAdmin = (Page, PageSize, accessToken) => {
    return axios.get(`http://localhost:5031/api/admin/user?Page=${Page}&PageSize=${PageSize}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const updateUserByAdmin = (id, firstName, lastName,  code,  phone, location, school,  accessToken) => {
    return axios.put(`http://localhost:5031/api/admin/user/${id}`, {firstName, lastName,  code,  phone, location, school}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getUserById = (id, accessToken) => {
    return axios.get(`http://localhost:5031/api/admin/user/${id}`,  {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const checkEmail = (email) => {
    return axios.post("http://localhost:5031/api/authenticate/forgot-password", {email})
}

const forgotPassword = (token, password, confirmPassword) => {
    return axios.post("http://localhost:5031/api/authenticate/reset-password", {token, password, confirmPassword})
}

const resetPassword = (id, currentPassword, newPassword, confirmPassword, accessToken) => {
    return axios.post(`http://localhost:5031/api/authenticate/change-password/${id}`, {currentPassword, newPassword, confirmPassword}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const refreshToken = (refreshToken,accessToken) => {
    return axios.get(`http://localhost:5031/api/authenticate/refresh-token?refreshToken=${refreshToken}`, {
         headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getUser = (id, accessToken) => {
    return axios.get(`http://localhost:5031/api/user/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const updateUser = (id, firstName, lastName,  code,  phone, location, school,  accessToken) => {
    return axios.put(`http://localhost:5031/api/user/${id}`, {firstName, lastName,  code,  phone, location, school}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const dashBoard = (year, accessToken) => {
    return axios.post(`http://localhost:5031/api/admin/user/dashboard?year=${year}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export {
    getUserByAdmin,
    updateUserByAdmin,
    getUserById,
    checkEmail,
    forgotPassword,
    resetPassword,
    refreshToken, 
    getUser,
    updateUser,
    dashBoard
}