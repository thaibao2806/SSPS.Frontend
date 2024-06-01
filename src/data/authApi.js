import axios from "axios"
import { activeAccountOTP, changePassword, checkEmail, dashBoards, forgotPasswords, getUserAdmin, getUserId, getUsers, refresh, resetPasswordOtp, resetPasswords, updateUserAdmin, updateUsers, url } from "../config"

const getUserByAdmin = (Page, PageSize, accessToken,axoisJWT) => {
    return axoisJWT.get(url + getUserAdmin +`?Page=${Page}&PageSize=${PageSize}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const activeAccount = ( email, otp) => {
    return axios.post(url + activeAccountOTP, {email, otp})
}

const updateUserByAdmin = (id, firstName, lastName,  code,  phone, location, school, statsus,  accessToken, axoisJWT) => {
    return axoisJWT.put(url + updateUserAdmin +`${id}`, {firstName, lastName,  code,  phone, location, school, statsus}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const getUserById = (id, accessToken, axoisJWT) => {
    return axoisJWT.get(url + getUserId + `${id}`,  {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
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

const resetPassword = (id, currentPassword, newPassword, confirmPassword, accessToken, axoisJWT) => {
    return axoisJWT.post(url + changePassword +`${id}`, {currentPassword, newPassword, confirmPassword}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}



const refreshToken = (refreshToken,accessToken) => {
    return axios.get(url + refresh + `${refreshToken}`, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const getUser = (id, accessToken, axoisJWT) => {
    console.log(url + updateUsers + `${id}`)
    return axoisJWT.get(url + getUsers + `${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const updateUser = (id, firstName, lastName,  code,  phone, location, school,status,  accessToken, axoisJWT) => {
    console.log(url + updateUsers + `${id}`)
    return axoisJWT.put(url + updateUsers + `${id}`, {firstName, lastName,  code,  phone, location, school, status}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
}

const dashBoard = (year, accessToken, axoisJWT) => {
    return axoisJWT.post(url + dashBoards + `${year}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420"
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