import React from 'react';
import { Route } from 'react-router-dom';
import { GuestRoute } from '../../routes/AuthRouteGuards';
import { PATHS } from '../../routes/paths';
import AdminAuthLayout from './components/AdminAuthLayout/AdminAuthLayout';
import AdminLogin from './pages/AdminLogin/AdminLogin';

export default [
  <Route key="admin-login-guest" element={<GuestRoute accountType="admin" redirectTo={PATHS.ADMIN_DASHBOARD} />}>
    <Route element={<AdminAuthLayout />}>
      <Route path={PATHS.ADMIN_LOGIN} element={<AdminLogin />} />
    </Route>
  </Route>,
];
