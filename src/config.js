export const url = "http://localhost:5031"
export const urlChatBox = "http://localhost:5031"
// report user
export const getReportUser = "/api/user/dashboard-user"
// auth
export const loginUsers = "/api/authenticate/login"
export const loginAdmins = "/api/authenticate/login"
export const register = "/api/authenticate/register"
export const registerOTP = "/api/authenticate/register-otp"
export const activeAccountOTP = "/api/authenticate/active-account-otp"
export const createUsers = "/api/authenticate/register"
export const getUserAdmin = "/api/admin/user"
export const updateUserAdmin = "/api/admin/user/"
export const getUserId = "/api/admin/user/"
export const forgotPasswords = "/api/authenticate/forgot-password"
export const resetPasswords = "/api/authenticate/reset-password"
export const changePassword = "/api/authenticate/change-password/"
export const refresh = "/api/authenticate/refresh-token?refreshToken="
export const getUsers = "/api/user/"
export const updateUsers = "/api/user/"
export const dashBoards = "/api/admin/user/dashboard?year="
export const checkEmail = "/api/authenticate/forgot-password-otp"
export const resetPasswordOtp = "/api/authenticate/forgot-password-otp"
// calendar
export const createMoneyPlans = "/api/user/money-plan"
export const getMoneyPlanId = "/api/user/money-plan/"
export const getMoneyPlanRange = "/api/user/money-plan/range-type"
export const updateMoneyPlans = "/api/user/money-plan/update-money-plan"
export const deleteMoneyPlan = "/api/user/money-plan/delete-money-plan"
export const updateUsageMoney = "/api/user/money-plan/update-usage-money-plan"
export const getCategory = "/api/user/category"
export const updateCategory = "/api/user/update-category"
export const deleteCategory = "/api/user/delete-category"
export const createListPlan = "/api/user/money-plan/create-list-money-plan"
// chat
export const chat = "/chatbox"
export const chatbot = '/api/external/chat-bot'
export const chatbotAdmin = '/api/external/chat-bot'

// note
export const createNotes = "/api/user/note"
export const getNotes = "/api/user/note/get-in-range"
export const updateNotes =  "/api/user/note"
export const deleteNotes =  "/api/user/note/delete"
// todo
export const createTodo = "/api/user/to-do-note"
export const getTodo = "/api/user/to-do-note/get-all"
export const updateTodo = "/api/user/to-do-note"
export const deleteTodo = "/api/user/to-do-note/delete"
export const createCard = "/api/user/to-do-card"
export const updateCard = "/api/user/to-do-card"
export const deleteCard = "/api/user/to-do-card/delete"
export const swapCard = "/api/user/to-do-card/swap"





