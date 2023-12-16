import axios from "axios";

export const createTodoNote = (title, fromDate, toDate, color, cards, accessToken) => {
    return axios.post("http://localhost:5031/api/user/to-do-note", {title, fromDate, toDate, color, cards}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const updateTodoNote = (id,title, fromDate, toDate, color, cards, accessToken) => {
    return axios.put("http://localhost:5031/api/user/to-do-note", {id,title, fromDate, toDate, color, cards}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteTodoNote = (id, accessToken) => {
    return axios.post(`http://localhost:5031/api/user/to-do-note/delete?Id=${id}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const getAllTodoNote = (accessToken) => {
    return axios.get("http://localhost:5031/api/user/to-do-note/get-all", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const createTodoCard = (toDoNoteId, card, accessToken) => {
    return axios.post("http://localhost:5031/api/user/to-do-card", {toDoNoteId, card}, {
       headers: {
            Authorization: `Bearer ${accessToken}`
        } 
    })
}

export const updateTodoCard = (toDoNoteId, cardId, title, description, accessToken) => {
    return axios.put("http://localhost:5031/api/user/to-do-card", {toDoNoteId, cardId, title, description}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteTodoCard = (ToDoNoteId, CardId, accessToken) => {
    return axios.post(`http://localhost:5031/api/user/to-do-card/delete?ToDoNoteId=${ToDoNoteId}&CardId=${CardId}`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const swapTodoCard = (CardId, FromToDoNoteId, ToToDoNoteId, accessToken) => {
    return axios.get(`http://localhost:5031/api/user/to-do-card/swap?CardId=${CardId}&FromToDoNoteId=${FromToDoNoteId}&ToToDoNoteId=${ToToDoNoteId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}