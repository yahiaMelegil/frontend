import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import solveItLogo from '../../../../assets/images/solveit-logo.png';
import { PATHS } from '../../../../routes/paths';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import ExpertAuthShowcase from '../ExpertAuthShowcase/ExpertAuthShowcase';
import '../../../auth/auth.css';
import '../../expertAuth.css';

const EXPERT_AUTH_MODE_BY_PATH = Object.freeze({
  [PATHS.EXPERT_LOGIN]: 'login',
  [PATHS.EXPERT_REGISTER]: 'register',
  [PATHS.EXPERT_FORGOT_PASSWORD]: 'forgot',
  [PATHS.EXPERT_RESET_PASSWORD]: 'reset',
  [PATHS.EXPERT_VERIFY_EMAIL]: 'verify',
  [PATHS.EXPERT_EMAIL_VERIFIED]: 'verified',
});

const AuthLogo = () => (
  <Link className="expert-auth-logo" to={PATHS.HOME} aria-label="العودة إلى الرئيسية">
    <img src={solveItLogo} alt="SolveIt" />
    <span className="expert-auth-logo__context">مساحة الخبير</span>
  </Link>
);

export default function ExpertAuthLayout() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || PATHS.HOME;
  const mode = normalizedPath.startsWith(`${PATHS.EXPERT_VERIFY_EMAIL}/`)
    ? 'verify'
    : (EXPERT_AUTH_MODE_BY_PATH[normalizedPath] || 'login');

  return (
    <main className={`expert-auth-page expert-auth-page--${mode}`}>
      <div className="expert-auth-shell">
        <section className="expert-auth-form-panel">
          <div className="expert-auth-form-panel__top">
            <AuthLogo />
            <Link className="expert-auth-back" to={PATHS.HOME}><AuthIcon name="arrow" size={17}/> الرئيسية</Link>
          </div>
          <div className="expert-auth-form-panel__body">
            <Outlet />
          </div>
          <div className="expert-auth-form-panel__footer"><AuthIcon name="shield" size={14}/> مساحة مهنية آمنة • النشر بعد التحقق فقط</div>
        </section>
        <ExpertAuthShowcase mode={mode} />
      </div>
    </main>
  );
}
