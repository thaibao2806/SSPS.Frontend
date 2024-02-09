import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import LoginAdmin from "../pages/LoginAdmin";
import App from '../App';
import Register from '../pages/Register';
import AppAdmin from '../pages/admin/App'
import Dashboard from "../pages/user/dashboard";
import Team from "../pages/user/team";
import Invoices from "../pages/user/invoices";
import Contacts from "../pages/user/contacts";
import Bar from "../pages/user/bar";
import Form from "../pages/user/form";
import Line from "../pages/user/line";
import Pie from "../pages/user/pie";
import FAQ from "../pages/user/faq";
import Geography from "../pages/user/geography";
import Calendar from "../pages/user/calendar/calendar";
import NotFound from './NotFound';
import CheckEmail from '../pages/CheckEmai';
import ResetPassword from '../pages/ResetPassword';
import UpdateAccount from "../pages/user/update_account"
import ForgotPassword from '../pages/ForgotPassword';
import Board from '../pages/user/board/Board';
import { ToastContainer } from 'react-toastify';
import Pomodoro from '../pages/user/pomodoro';


const AppRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/line" element={<Line />} /> */}
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/todo" element={<Board />} />
          <Route path="/calendar" element={<Calendar />} />
          {/* <Route path="/geography" element={<Geography />} /> */}
          <Route path="/update-account" element={<UpdateAccount />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="/system/admin/login" element={<LoginAdmin />} />
        <Route path="register" element={<Register />} />
        <Route path="/system/admin/*" element={<AppAdmin />}></Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/checkmail" element={<CheckEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default AppRoute