import axios from "axios";
import { createCard, createTodo, deleteCard, deleteTodo, getTodo, swapCard, updateCard, updateTodo, url } from "../config";


export const createTodoNote = (title, fromDate, toDate, color, cards, accessToken, axoisJWT) => {
    return axoisJWT.post(url + createTodo, {title, fromDate, toDate, color, cards}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const updateTodoNote = (id,title, fromDate, toDate, color, cards, accessToken, axoisJWT) => {
    return axoisJWT.put(url + updateTodo, {id,title, fromDate, toDate, color, cards}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteTodoNote = (id, accessToken, axoisJWT) => {
    return axoisJWT.post(url + deleteTodo +`?Id=${id}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const getAllTodoNote = (accessToken, axoisJWT) => {
    return axoisJWT.get(url + getTodo, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const createTodoCard = (toDoNoteId, card, accessToken, axoisJWT) => {
    return axoisJWT.post(url + createCard, {toDoNoteId, card}, {
       headers: {
            Authorization: `Bearer ${accessToken}`
        } 
    })
}

export const updateTodoCard = (toDoNoteId, cardId, title, description, accessToken, axoisJWT) => {
    return axoisJWT.put(url + updateCard, {toDoNoteId, cardId, title, description}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteTodoCard = (ToDoNoteId, CardId, accessToken, axoisJWT) => {
    return axoisJWT.post(url + deleteCard +`?ToDoNoteId=${ToDoNoteId}&CardId=${CardId}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const swapTodoCard = (CardId, FromToDoNoteId, ToToDoNoteId, accessToken, axoisJWT) => {
    return axoisJWT.get(url + swapCard +`?CardId=${CardId}&FromToDoNoteId=${FromToDoNoteId}&ToToDoNoteId=${ToToDoNoteId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}