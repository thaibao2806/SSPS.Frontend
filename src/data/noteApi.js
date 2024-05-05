import axios from "axios"
import { createNotes, deleteNotes, getNotes, updateNotes, url } from "../config"


export const createNote = (title, description, color, fromDate, toDate, accessToken, axoisJWT) => {
    return axoisJWT.post(url + createNotes, {title, description, color, fromDate, toDate}, {headers: {Authorization: `Bearer ${accessToken}`}})
}

export const getNote = (FromDate, ToDate, accessToken, axoisJWT) => {
    return axoisJWT.get(url + getNotes + `?FromDate=${FromDate}&ToDate=${ToDate}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
    })
}

export const updateNote = (id,title, description, color, fromDate, toDate, accessToken, axoisJWT) => {
    return axoisJWT.put(url + updateNotes, {id,title, description, color, fromDate, toDate}, {headers: {Authorization: `Bearer ${accessToken}`}})
}

export const deleteNote = (id, accessToken, axoisJWT) => {
    return axoisJWT.post(url + deleteNotes + `?Id=${id}`, null, {headers: {Authorization: `Bearer ${accessToken}`}})
}