import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import AuthInput from '../../../auth/components/AuthInput/AuthInput';
import PasswordToggle from '../../../auth/components/PasswordToggle/PasswordToggle';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { PATHS } from '../../../../routes/paths';
import { getAdminLoginErrors } from '../../utils/adminAuthValidation';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const errors = useMemo(() => getAdminLoginErrors({ email, password }), [email, password]);
  const hasErrors = Boolean(errors.email || errors.password);

  const clearServerErrors = () => {
    setAuthError('');
    setFieldErrors({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    clearServerErrors();
    if (hasErrors || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await loginAdmin({ email: email.trim(), password }, remember);
      const from = location.state?.from;
      const destination = from ? `${from.pathname || ''}${from.search || ''}${from.hash || ''}` : PATHS.ADMIN_DASHBOARD;
      navigate(destination || PATHS.ADMIN_DASHBOARD, { replace: true });
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setAuthError(getErrorMessage(error, 'تعذر تسجيل دخول الإدارة. حاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form admin-auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading admin-auth-form__heading">
        <span className="admin-auth-kicker"><AuthIcon name="shield" size={14}/> بوابة الإدارة</span>
        <h1>تسجيل دخول الإدارة</h1>
        <p>وصول مخصص للمستخدمين الإداريين المصرح لهم لإدارة المنصة ومراجعة العمليات ضمن صلاحياتهم.</p>
      </div>

      <div className="admin-auth-security-note">
        <AuthIcon name="lock" size={17}/>
        <span><b>منطقة إدارية آمنة</b> هذه المنطقة مخصصة للمستخدمين الإداريين المصرح لهم فقط.</span>
      </div>

      {authError && (
        <div className="admin-auth-alert" role="alert">
          <AuthIcon name="shield" size={16}/>
          <span>{authError}</span>
        </div>
      )}

      <div className="auth-form__fields">
        <AuthInput
          id="admin-login-email"
          label="البريد الإلكتروني الإداري"
          icon="mail"
          type="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); clearServerErrors(); }}
          placeholder="admin@example.com"
          autoComplete="email"
          error={submitted ? (errors.email || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')}
        />
        <AuthInput
          id="admin-login-password"
          label="كلمة المرور"
          icon="lock"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => { setPassword(event.target.value); clearServerErrors(); }}
          placeholder="••••••••"
          autoComplete="current-password"
          error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')}
          endAction={(
            <PasswordToggle
              visible={showPassword}
              onClick={() => setShowPassword((value) => !value)}
              label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            />
          )}
        />
      </div>

      <div className="auth-form__options admin-auth-form__options">
        <label className="auth-check">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>تذكرني على هذا الجهاز</span>
        </label>
        <span className="admin-auth-access-label"><AuthIcon name="shield" size={13}/> وصول إداري فقط</span>
      </div>

      <button className="auth-primary-btn admin-auth-primary-btn" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="admin-auth-spinner" aria-hidden="true" /> جارٍ التحقق...</> : <>تسجيل الدخول <AuthIcon name="arrow" size={18}/></>}
      </button>

      <p className="admin-auth-help">لا توجد إمكانية لإنشاء حساب إداري من هذه الصفحة. يتم منح صلاحيات الإدارة من خلال النظام المصرح به فقط.</p>
    </form>
  );
}
