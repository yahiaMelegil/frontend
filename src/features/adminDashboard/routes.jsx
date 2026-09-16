import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/AuthRouteGuards';
import { PATHS } from '../../routes/paths';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminKycPage from './pages/AdminKycPage/AdminKycPage';
import AdminKycReviewPage from './pages/AdminKycReviewPage/AdminKycReviewPage';
import AdminManagementPage from './pages/AdminManagementPage/AdminManagementPage';
import AdminRoleCreatePage from './pages/AdminRoleCreatePage';
import AdminRolesPage from './pages/AdminRolesPage/AdminRolesPage';
import AdminSettingsPage from './pages/AdminSettingsPage/AdminSettingsPage';
import AdminSubAdminsPage from './pages/AdminSubAdminsPage/AdminSubAdminsPage';

const ADMIN_MANAGEMENT_ROUTES = Object.freeze([
  [PATHS.ADMIN_CASES, 'cases'],
  [PATHS.ADMIN_EXPERTS, 'experts'],
  [PATHS.ADMIN_USERS, 'users'],
  [PATHS.ADMIN_COMPLAINTS, 'complaints'],
  [PATHS.ADMIN_RISK, 'risk'],
  [PATHS.ADMIN_DISPUTES, 'disputes'],
  [PATHS.ADMIN_POLICIES, 'policies'],
  [PATHS.ADMIN_AUDIT, 'audit'],
]);

export default [
  <Route key="admin-dashboard-protected" element={<ProtectedRoute accountType="admin" loginPath={PATHS.ADMIN_LOGIN} />}>
    <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
    {ADMIN_MANAGEMENT_ROUTES.map(([path, pageKey]) => (
      <Route key={path} path={path} element={<AdminManagementPage pageKey={pageKey} />} />
    ))}
    <Route path={PATHS.ADMIN_ROLES} element={<AdminRolesPage />} />
    <Route path={PATHS.ADMIN_ROLE_CREATE} element={<AdminRoleCreatePage />} />
    <Route path={PATHS.ADMIN_SUB_ADMINS} element={<AdminSubAdminsPage />} />
    <Route path={PATHS.ADMIN_KYC} element={<AdminKycPage />} />
    <Route path={PATHS.ADMIN_KYC_REVIEW} element={<AdminKycReviewPage />} />
    <Route path={PATHS.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
  </Route>,
];
