# Spendly Project Completion Summary

## Overview

Spendly is a full-stack expense tracking application with a React frontend and a Node.js/Express backend.

- Frontend: `Frontend/`
- Backend: `Backend/`
- The app uses Axios for API requests, React for UI, and Express + MongoDB for backend data handling.

## Frontend

The frontend is built with Vite, React, Tailwind CSS, and Recharts for charts.

### Key files

- `Frontend/src/App.jsx`
- `Frontend/src/main.jsx`
- `Frontend/src/utils/api.js` - Axios instance and exported API helper functions
- `Frontend/src/pages/Budgets.jsx` - budget management page
- `Frontend/src/pages/Dashboard.jsx`
- `Frontend/src/pages/MonthlySettings.jsx`
- `Frontend/src/pages/Notifications.jsx`
- `Frontend/src/pages/Settings.jsx`

### Important fix applied

- Added missing import in `Frontend/src/pages/Budgets.jsx`:
  - `import API, { getUserInfo, getExpenses } from "../utils/api";`
- This fixes the runtime error `ReferenceError: API is not defined` for `API.get`, `API.post`, and `API.delete` calls in `Budgets.jsx`.

## Backend

The backend is configured with Express and a set of controllers, models, and routes.

### Key files

- `Backend/server.js`
- `Backend/controller/expenseController.js`
- `Backend/controller/authController.js`
- `Backend/controller/userInfoController.js`
- `Backend/routes/expenseRoutes.js`
- `Backend/routes/authRoutes.js`
- `Backend/models/expenseModel.js`
- `Backend/models/userInfoModel.js`

### Backend scripts

- `npm run start` - start backend server
- `npm run dev` - start backend server with `nodemon`

## API configuration

`Frontend/src/utils/api.js` exports a shared Axios instance:

- Base URL: `https://spendly-backend-xzgc.onrender.com/api`
- Default export: `API`
- Also exports helper methods such as `registerUser`, `loginUser`, `getUserInfo`, `createExpense`, `getExpenses`, `getExpenseSummary`, and more.

## Setup instructions

### Backend

1. Open terminal in `Backend/`
2. Run `npm install`
3. Run `npm run dev` or `npm start`

### Frontend

1. Open terminal in `Frontend/`
2. Run `npm install`
3. Run `npm run dev`

## Notes

- The completion file confirms the project structure, the frontend/backend split, and the specific bug fix.
- No logic or API-call functionality was changed beyond ensuring the `API` import exists in the page that uses it.

## Status

- Frontend and backend are configured and ready for local development.
- The React `API` import issue has been fixed in `Frontend/src/pages/Budgets.jsx`.
