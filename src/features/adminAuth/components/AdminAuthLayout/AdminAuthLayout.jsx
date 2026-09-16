import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import solveItLogo from '../../../../assets/images/solveit-logo.png';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import AdminAuthShowcase from '../AdminAuthShowcase/AdminAuthShowcase';
import '../../../auth/auth.css';
import '../../adminAuth.css';
import { PATHS } from '../../../../routes/paths';

const AdminLogo = () => (
  <Link className="admin-auth-logo" to={PATHS.HOME} aria-label="العودة إلى الرئيسية">
    <img src={solveItLogo} alt="SolveIt" />
    <span className="admin-auth-logo__context">بوابة الإدارة</span>
  </Link>
);

export default function AdminAuthLayout() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-shell">
        <section className="admin-auth-form-panel">
          <div className="admin-auth-form-panel__top">
            <AdminLogo />
            <Link className="admin-auth-back" to={PATHS.HOME}><AuthIcon name="arrow" size={17}/> الرئيسية</Link>
          </div>
          <div className="admin-auth-form-panel__body">
            <Outlet />
          </div>
          <div className="admin-auth-form-panel__footer"><AuthIcon name="shield" size={14}/> دخول إداري محمي • الصلاحيات تُطبق من الخادم</div>
        </section>
        <AdminAuthShowcase />
      </div>
    </main>
  );
}
