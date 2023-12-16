import axios from "axios"

export const createNote = (title, description, color, fromDate, toDate, accessToken) => {
    return axios.post("http://localhost:5031/api/user/note", {title, description, color, fromDate, toDate}, {headers: {Authorization: `Bearer ${accessToken}`}})
}

export const getNote = (FromDate, ToDate, accessToken) => {
    return axios.get(`http://localhost:5031/api/user/note/get-in-range?FromDate=${FromDate}&ToDate=${ToDate}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
    })
}

export const updateNote = (id,title, description, color, fromDate, toDate, accessToken) => {
    return axios.put("http://localhost:5031/api/user/note", {id,title, description, color, fromDate, toDate}, {headers: {Authorization: `Bearer ${accessToken}`}})
}

export const deleteNote = (id, accessToken) => {
    return axios.post(`http://localhost:5031/api/user/note/delete?Id=${id}`, null, {headers: {Authorization: `Bearer ${accessToken}`}})
}