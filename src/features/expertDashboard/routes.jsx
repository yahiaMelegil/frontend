import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/AuthRouteGuards';
import { PATHS } from '../../routes/paths';
import ExpertDashboard from './pages/ExpertDashboard/ExpertDashboard';
import ExpertKyc from './pages/ExpertKyc/ExpertKyc';
import ExpertProfile from './pages/ExpertProfile/ExpertProfile';

export default [
  <Route key="expert-dashboard-protected" element={<ProtectedRoute accountType="expert" loginPath={PATHS.EXPERT_LOGIN} />}>
    <Route path={PATHS.EXPERT_DASHBOARD} element={<ExpertDashboard />} />
    <Route path={PATHS.EXPERT_PROFILE} element={<ExpertProfile />} />
    <Route path={PATHS.EXPERT_KYC} element={<ExpertKyc />} />
  </Route>,
];
