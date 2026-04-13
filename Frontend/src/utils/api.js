import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// User Info APIs
export const createUserInfo = (data) => API.post("/userInfo/create", data);
export const getUserInfo = (userId) => API.get(`/userInfo/${userId}`);
export const updateUserInfo = (userId, data) => API.put(`/userInfo/${userId}`, data);

// Expense APIs - CRUD
export const createExpense = (userId, data) => API.post("/expenses/create", { userId, ...data });
export const getExpenses = (userId, filters = {}) => API.get(`/expenses/${userId}`, { params: filters });
export const getExpenseById = (expenseId) => API.get(`/expenses/expense/${expenseId}`);
export const updateExpense = (expenseId, data) => API.put(`/expenses/${expenseId}`, data);
export const deleteExpense = (expenseId) => API.delete(`/expenses/${expenseId}`);

// Expense APIs - Summary & Analytics
export const getExpenseSummary = (userId, filters = {}) => API.get(`/expenses/${userId}/summary`, { params: filters });

// Expense APIs - Import/Export
export const importExpenses = (userId, expenses) => API.post(`/expenses/${userId}/import`, { expenses });
export const exportExpenses = (userId, filters = {}) => API.get(`/expenses/${userId}/export`, { params: filters, responseType: 'blob' });

export default API;