import { Link, useSearchParams } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import AuthApiAlert from '../../components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import AuthInput from '../../components/AuthInput/AuthInput';
import PasswordToggle from '../../components/PasswordToggle/PasswordToggle';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getPasswordStrength, getResetPasswordErrors } from '../../utils/authValidation';
import { PATHS } from '../../../../routes/paths';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { resetUserPassword } = useAuth();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const errors = useMemo(() => getResetPasswordErrors({ password, confirm }), [password, confirm]);
  const hasErrors = Object.values(errors).some(Boolean);
  const hasResetParams = Boolean(email && token);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setGeneralError('');
    setFieldErrors({});
    if (!hasResetParams) {
      setGeneralError('رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا وحاول مرة أخرى.');
      return;
    }
    if (hasErrors || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = await resetUserPassword({
        email,
        token,
        password,
        password_confirmation: confirm,
      });
      setSuccessMessage(payload?.message || 'تم تغيير كلمة المرور بنجاح.');
      setSuccess(true);
    } catch (requestError) {
      const nextFieldErrors = getFieldErrors(requestError);
      setFieldErrors(nextFieldErrors);
      setGeneralError(getFirstFieldError(nextFieldErrors, 'email') || getErrorMessage(requestError, 'تعذر تغيير كلمة المرور. حاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form auth-state-card">
        <span className="auth-state-icon auth-state-icon--success"><AuthIcon name="check" size={29}/></span>
        <span className="auth-kicker">تم التحديث</span>
        <h1>تم تغيير كلمة المرور</h1>
        <p>{successMessage}</p>
        <Link className="auth-primary-btn" to={PATHS.LOGIN}>تسجيل الدخول <AuthIcon name="arrow" size={18}/></Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading">
        <span className="auth-kicker"><AuthIcon name="lock" size={14}/> كلمة مرور جديدة</span>
        <h1>أنشئ كلمة مرور قوية</h1>
        <p>استخدم كلمة مرور جديدة لحسابك. رابط الاستعادة مخصص لهذه العملية ومحدود الصلاحية.</p>
      </div>

      {!hasResetParams && <AuthApiAlert message="رابط الاستعادة لا يحتوي على البريد الإلكتروني ورمز الاستعادة المطلوبين." />}
      <AuthApiAlert message={generalError} />

      <div className="auth-form__fields">
        <AuthInput id="reset-password" label="كلمة المرور الجديدة" icon="lock" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setGeneralError(''); setFieldErrors({}); }} placeholder="8 أحرف أو أكثر" autoComplete="new-password" error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')} endAction={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((value) => !value)} label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} />} />
        {password && (
          <div className="auth-strength" aria-label="قوة كلمة المرور">
            <div className="auth-strength__bars">{[1, 2, 3, 4].map((number) => <i key={number} className={number <= strength ? 'is-on' : ''}/>)}</div>
            <span>{strength <= 1 ? 'ضعيفة' : strength === 2 ? 'متوسطة' : strength === 3 ? 'جيدة' : 'قوية'}</span>
          </div>
        )}
        <AuthInput id="reset-confirm" label="تأكيد كلمة المرور" icon="lock" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); setGeneralError(''); setFieldErrors({}); }} placeholder="أعد كتابة كلمة المرور" autoComplete="new-password" error={submitted ? (errors.confirm || getFirstFieldError(fieldErrors, 'password_confirmation')) : getFirstFieldError(fieldErrors, 'password_confirmation')} endAction={<PasswordToggle visible={showConfirm} onClick={() => setShowConfirm((value) => !value)} label={showConfirm ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'} />} />
      </div>

      <div className="auth-info-row auth-info-row--spaced"><AuthIcon name="shield" size={17}/><span>بعد نجاح التغيير، لن يتم الاعتماد على أي جلسة قديمة مرتبطة بكلمة المرور السابقة.</span></div>
      <button className="auth-primary-btn" type="submit" disabled={isSubmitting || !hasResetParams} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ الحفظ...</> : <>حفظ كلمة المرور الجديدة <AuthIcon name="arrow" size={18}/></>}
      </button>
      <p className="auth-switch">تحتاج رابطًا جديدًا؟ <Link to={PATHS.FORGOT_PASSWORD}>طلب استعادة جديدة</Link></p>
    </form>
  );
}
