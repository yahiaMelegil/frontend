import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import AuthApiAlert from '../../components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import AuthInput from '../../components/AuthInput/AuthInput';
import PasswordToggle from '../../components/PasswordToggle/PasswordToggle';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getLoginErrors } from '../../utils/authValidation';
import { PATHS } from '../../../../routes/paths';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const errors = useMemo(() => getLoginErrors({ email, password }), [email, password]);
  const hasErrors = Boolean(errors.email || errors.password);

  const clearServerErrors = () => {
    setGeneralError('');
    setFieldErrors({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    clearServerErrors();
    if (hasErrors || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await loginUser({ email: email.trim(), password }, remember);
      const from = location.state?.from;
      const destination = from ? `${from.pathname || ''}${from.search || ''}${from.hash || ''}` : PATHS.USER_DASHBOARD;
      navigate(destination || PATHS.USER_DASHBOARD, { replace: true });
    } catch (error) {
      const nextFieldErrors = getFieldErrors(error);
      setFieldErrors(nextFieldErrors);
      setGeneralError(getErrorMessage(error, 'تعذر تسجيل الدخول. حاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading">
        <span className="auth-kicker">تسجيل الدخول</span>
        <h1>أهلًا بعودتك</h1>
        <p>أدخل بياناتك للوصول إلى حالاتك ومساحة عملك.</p>
      </div>

      <AuthApiAlert message={generalError} />

      <div className="auth-form__fields">
        <AuthInput id="login-email" label="البريد الإلكتروني" icon="mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearServerErrors(); }} placeholder="name@example.com" autoComplete="email" error={submitted ? (errors.email || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')} />
        <AuthInput id="login-password" label="كلمة المرور" icon="lock" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearServerErrors(); }} placeholder="••••••••" autoComplete="current-password" error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')} endAction={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((v) => !v)} label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} />} />
      </div>

      <div className="auth-form__options">
        <label className="auth-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>تذكرني</span></label>
        <Link className="auth-text-button" to={PATHS.FORGOT_PASSWORD}>نسيت كلمة المرور؟</Link>
      </div>

      <button className="auth-primary-btn" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ تسجيل الدخول...</> : <>تسجيل الدخول <AuthIcon name="arrow" size={18}/></>}
      </button>
      <div className="auth-separator"><span>أو</span></div>
      <p className="auth-switch">ليس لديك حساب؟ <Link to={PATHS.REGISTER}>أنشئ حسابًا جديدًا</Link></p>
    </form>
  );
}
