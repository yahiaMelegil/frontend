import React from 'react';
import { Route } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '../../routes/AuthRouteGuards';
import { PATHS } from '../../routes/paths';
import AuthLayout from './components/AuthLayout/AuthLayout';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import EmailVerified from './pages/EmailVerified/EmailVerified';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ResetPassword from './pages/ResetPassword/ResetPassword';

export default [
  <Route key="user-login-guest" element={<GuestRoute accountType="user" redirectTo={PATHS.USER_DASHBOARD} />}>
    <Route element={<AuthLayout />}>
      <Route path={PATHS.LOGIN} element={<Login />} />
    </Route>
  </Route>,
  <Route key="user-auth-public" element={<AuthLayout />}>
    <Route path={PATHS.REGISTER} element={<Register />} />
    <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
    <Route path={PATHS.VERIFY_EMAIL_CALLBACK} element={<EmailVerification />} />
    <Route path={PATHS.EMAIL_VERIFIED} element={<EmailVerified />} />
  </Route>,
  <Route key="user-email-protected" element={<ProtectedRoute accountType="user" loginPath={PATHS.LOGIN} />}>
    <Route element={<AuthLayout />}>
      <Route path={PATHS.VERIFY_EMAIL} element={<EmailVerification />} />
    </Route>
  </Route>,
];
