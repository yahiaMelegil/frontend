import React from 'react';
import { Route } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '../../routes/AuthRouteGuards';
import { PATHS } from '../../routes/paths';
import ExpertAuthLayout from './components/ExpertAuthLayout/ExpertAuthLayout';
import ExpertEmailVerification from './pages/ExpertEmailVerification/ExpertEmailVerification';
import ExpertEmailVerified from './pages/ExpertEmailVerified/ExpertEmailVerified';
import ExpertForgotPassword from './pages/ExpertForgotPassword/ExpertForgotPassword';
import ExpertLogin from './pages/ExpertLogin/ExpertLogin';
import ExpertRegister from './pages/ExpertRegister/ExpertRegister';
import ExpertResetPassword from './pages/ExpertResetPassword/ExpertResetPassword';

export default [
  <Route key="expert-login-guest" element={<GuestRoute accountType="expert" redirectTo={PATHS.EXPERT_DASHBOARD} />}>
    <Route element={<ExpertAuthLayout />}>
      <Route path={PATHS.EXPERT_LOGIN} element={<ExpertLogin />} />
    </Route>
  </Route>,
  <Route key="expert-auth-public" element={<ExpertAuthLayout />}>
    <Route path={PATHS.EXPERT_REGISTER} element={<ExpertRegister />} />
    <Route path={PATHS.EXPERT_FORGOT_PASSWORD} element={<ExpertForgotPassword />} />
    <Route path={PATHS.EXPERT_RESET_PASSWORD} element={<ExpertResetPassword />} />
    <Route path={PATHS.EXPERT_VERIFY_EMAIL_CALLBACK} element={<ExpertEmailVerification />} />
    <Route path={PATHS.EXPERT_EMAIL_VERIFIED} element={<ExpertEmailVerified />} />
  </Route>,
  <Route key="expert-email-protected" element={<ProtectedRoute accountType="expert" loginPath={PATHS.EXPERT_LOGIN} />}>
    <Route element={<ExpertAuthLayout />}>
      <Route path={PATHS.EXPERT_VERIFY_EMAIL} element={<ExpertEmailVerification />} />
    </Route>
  </Route>,
];
