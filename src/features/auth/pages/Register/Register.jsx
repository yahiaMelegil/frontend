import { Link, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import AuthApiAlert from '../../components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import AuthInput from '../../components/AuthInput/AuthInput';
import PasswordToggle from '../../components/PasswordToggle/PasswordToggle';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getPasswordStrength, getRegisterErrors } from '../../utils/authValidation';
import { PATHS } from '../../../../routes/paths';

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const errors = useMemo(() => getRegisterErrors({ name, email, password, confirm, terms }), [name, email, password, confirm, terms]);
  const hasErrors = Object.values(errors).some(Boolean);

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
      const payload = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirm,
      });
      navigate(`${PATHS.VERIFY_EMAIL}?email=${encodeURIComponent(email.trim())}`, {
        replace: true,
        state: { message: payload?.message || '' },
      });
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setGeneralError(getErrorMessage(error, 'تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form auth-form--register" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading">
        <span className="auth-kicker">حساب جديد</span>
        <h1>ابدأ حالتك بثقة</h1>
        <p>حساب واحد للوصول إلى خبرائك وحالاتك وسياقك المنظّم.</p>
      </div>

      <AuthApiAlert message={generalError} />

      <div className="auth-form__fields auth-form__fields--register">
        <AuthInput id="register-name" label="الاسم الكامل" icon="user" value={name} onChange={(e) => { setName(e.target.value); clearServerErrors(); }} placeholder="اكتب اسمك الكامل" autoComplete="name" error={submitted ? (errors.name || getFirstFieldError(fieldErrors, 'name')) : getFirstFieldError(fieldErrors, 'name')} />
        <AuthInput id="register-email" label="البريد الإلكتروني" icon="mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearServerErrors(); }} placeholder="name@example.com" autoComplete="email" error={submitted ? (errors.email || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')} />
        <AuthInput id="register-password" label="كلمة المرور" icon="lock" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearServerErrors(); }} placeholder="8 أحرف أو أكثر" autoComplete="new-password" error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')} endAction={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((v) => !v)} label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} />} />
        {password && (
          <div className="auth-strength" aria-label="قوة كلمة المرور">
            <div className="auth-strength__bars">{[1,2,3,4].map((n) => <i key={n} className={n <= strength ? 'is-on' : ''}/>)}</div>
            <span>{strength <= 1 ? 'ضعيفة' : strength === 2 ? 'متوسطة' : strength === 3 ? 'جيدة' : 'قوية'}</span>
          </div>
        )}
        <AuthInput id="register-confirm" label="تأكيد كلمة المرور" icon="lock" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); clearServerErrors(); }} placeholder="أعد كتابة كلمة المرور" autoComplete="new-password" error={submitted ? (errors.confirm || getFirstFieldError(fieldErrors, 'password_confirmation')) : getFirstFieldError(fieldErrors, 'password_confirmation')} endAction={<PasswordToggle visible={showConfirm} onClick={() => setShowConfirm((v) => !v)} label={showConfirm ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'} />} />
      </div>

      <label className={`auth-check auth-check--terms ${submitted && errors.terms ? 'auth-check--error' : ''}`}>
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span>أوافق على <a href="#terms">الشروط والأحكام</a> و<a href="#privacy">سياسة الخصوصية</a>.</span>
      </label>
      {submitted && errors.terms && <small className="auth-error auth-error--terms">{errors.terms}</small>}

      <button className="auth-primary-btn" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ إنشاء الحساب...</> : <>إنشاء الحساب <AuthIcon name="arrow" size={18}/></>}
      </button>
      <p className="auth-expert-note"><span><AuthIcon name="nodes" size={16}/></span> هل أنت خبير؟ <Link to={`${PATHS.HOME}#join`}>ابدأ طلب الانضمام كخبير</Link> بعد إنشاء هويتك الأساسية.</p>
      <p className="auth-switch">لديك حساب بالفعل؟ <Link to={PATHS.LOGIN}>تسجيل الدخول</Link></p>
    </form>
  );
}
