import axios from "axios"
import { activeAccountOTP, changePassword, checkEmail, dashBoards, forgotPasswords, getUserAdmin, getUserId, getUsers, refresh, resetPasswordOtp, resetPasswords, updateUserAdmin, updateUsers, url } from "../config"

const getUserByAdmin = (Page, PageSize, accessToken) => {
    return axios.get(url + getUserAdmin +`?Page=${Page}&PageSize=${PageSize}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const activeAccount = ( email, otp) => {
    return axios.post(url + activeAccountOTP, {email, otp})
}

const updateUserByAdmin = (id, firstName, lastName,  code,  phone, location, school,  accessToken) => {
    return axios.put(url + updateUserAdmin +`${id}`, {firstName, lastName,  code,  phone, location, school}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getUserById = (id, accessToken) => {
    return axios.get(url + getUserId + `${id}`,  {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

// const checkEmail = (email) => {
//     return axios.post(url + forgotPasswords, {email})
// }

const checkEmailOTP = (email) => {
    return axios.post(url + checkEmail, {email})
}

const forgotPassword = (token, password, confirmPassword) => {
    return axios.post(url + resetPasswords, {token, password, confirmPassword})
}

const forgotPasswordOTP = (otp,email,  password, confirmPassword) => {
    return axios.post(url + resetPasswordOtp, {otp,email, password, confirmPassword})
}

const resetPassword = (id, currentPassword, newPassword, confirmPassword, accessToken) => {
    return axios.post(url + changePassword +`${id}`, {currentPassword, newPassword, confirmPassword}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}



const refreshToken = (refreshToken,accessToken) => {
    return axios.get(url + refresh + `${refreshToken}`, {
         headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const getUser = (id, accessToken) => {
    return axios.get(url + getUsers + `${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const updateUser = (id, firstName, lastName,  code,  phone, location, school,  accessToken) => {
    return axios.put(url + updateUsers + `${id}`, {firstName, lastName,  code,  phone, location, school}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const dashBoard = (year, accessToken) => {
    return axios.post(url + dashBoards + `${year}`, null, {
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
    dashBoard,
    checkEmailOTP,
    forgotPasswordOTP,
    activeAccount
}