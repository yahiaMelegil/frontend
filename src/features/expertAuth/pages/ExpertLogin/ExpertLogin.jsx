import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import AuthApiAlert from '../../../auth/components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import AuthInput from '../../../auth/components/AuthInput/AuthInput';
import PasswordToggle from '../../../auth/components/PasswordToggle/PasswordToggle';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getExpertLoginErrors } from '../../utils/expertAuthValidation';
import { PATHS } from '../../../../routes/paths';

export default function ExpertLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginExpert } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const errors = useMemo(() => getExpertLoginErrors({ email, password }), [email, password]);
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
      const payload = await loginExpert({ email: email.trim(), password }, remember);
      const from = location.state?.from;
      if (from) {
        navigate(`${from.pathname || ''}${from.search || ''}${from.hash || ''}` || PATHS.HOME, { replace: true });
      } else if (payload?.data?.email_verified === false) {
        navigate(`${PATHS.EXPERT_VERIFY_EMAIL}?email=${encodeURIComponent(email.trim())}`, { replace: true });
      } else {
        navigate(PATHS.HOME, { replace: true });
      }
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setGeneralError(getErrorMessage(error, 'تعذر تسجيل دخول الخبير. حاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form expert-auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading expert-auth-form__heading">
        <span className="expert-auth-kicker"><AuthIcon name="nodes" size={14}/> دخول الخبراء</span>
        <h1>مرحبًا بعودتك</h1>
        <p>ادخل إلى مساحة الخبير لمتابعة الطلبات والسياق المهني المرتبط بك.</p>
      </div>

      <div className="expert-auth-context-note"><AuthIcon name="shield" size={16}/><span><b>بوابة منفصلة للخبير</b> استخدم بيانات هويتك الأساسية المرتبطة بدورك المهني.</span></div>
      <AuthApiAlert message={generalError} />

      <div className="auth-form__fields">
        <AuthInput id="expert-login-email" label="البريد الإلكتروني" icon="mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearServerErrors(); }} placeholder="name@example.com" autoComplete="email" error={submitted ? (errors.email || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')} />
        <AuthInput id="expert-login-password" label="كلمة المرور" icon="lock" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearServerErrors(); }} placeholder="••••••••" autoComplete="current-password" error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')} endAction={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((value) => !value)} label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} />} />
      </div>

      <div className="auth-form__options">
        <label className="auth-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>تذكرني</span></label>
        <Link className="auth-text-button expert-auth-text-link" to={PATHS.EXPERT_FORGOT_PASSWORD}>نسيت كلمة المرور؟</Link>
      </div>

      <button className="auth-primary-btn expert-auth-primary-btn" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ تسجيل الدخول...</> : <>دخول مساحة الخبير <AuthIcon name="arrow" size={18}/></>}
      </button>
      <div className="auth-separator"><span>أو</span></div>
      <p className="auth-switch">ليس لديك دور خبير بعد؟ <Link to={PATHS.EXPERT_REGISTER}>انضم كخبير</Link></p>
      <p className="expert-auth-secondary-switch">تريد الدخول كمستخدم عادي؟ <Link to={PATHS.LOGIN}>تسجيل دخول المستخدم</Link></p>
    </form>
  );
}
