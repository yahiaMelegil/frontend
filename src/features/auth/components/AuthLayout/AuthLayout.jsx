import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import solveItLogo from '../../../../assets/images/solveit-logo.png';
import { PATHS } from '../../../../routes/paths';
import AuthIcon from '../AuthIcon/AuthIcon';
import AuthShowcase from '../AuthShowcase/AuthShowcase';
import '../../auth.css';

const AUTH_MODE_BY_PATH = Object.freeze({
  [PATHS.LOGIN]: 'login',
  [PATHS.REGISTER]: 'register',
  [PATHS.FORGOT_PASSWORD]: 'forgot',
  [PATHS.RESET_PASSWORD]: 'reset',
  [PATHS.VERIFY_EMAIL]: 'verify',
  [PATHS.EMAIL_VERIFIED]: 'verified',
});

const AuthLogo = () => (
  <Link className="auth-logo" to={PATHS.HOME} aria-label="العودة إلى الرئيسية">
    <img src={solveItLogo} alt="SolveIt" />
    <span className="auth-logo__context">خبراء وسياق موحّد</span>
  </Link>
);

export default function AuthLayout() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || PATHS.HOME;
  const mode = normalizedPath.startsWith(`${PATHS.VERIFY_EMAIL}/`)
    ? 'verify'
    : (AUTH_MODE_BY_PATH[normalizedPath] || 'login');

  return (
    <main className={`auth-page auth-page--${mode}`}>
      <div className="auth-shell">
        <div className="auth-form-panel">
          <div className="auth-form-panel__top">
            <AuthLogo />
            <Link className="auth-back" to={PATHS.HOME}><AuthIcon name="arrow" size={17}/> الرئيسية</Link>
          </div>
          <div className="auth-form-panel__body">
            <Outlet />
          </div>
          <div className="auth-form-panel__footer"><AuthIcon name="shield" size={14}/> اتصال آمن • بياناتك لا تُشارك إلا بإذنك</div>
        </div>
        <AuthShowcase mode={mode} />
      </div>
    </main>
  );
}
