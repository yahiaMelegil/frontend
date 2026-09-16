import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import AuthApiAlert from '../../components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import AuthInput from '../../components/AuthInput/AuthInput';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getForgotPasswordError } from '../../utils/authValidation';
import { PATHS } from '../../../../routes/paths';

export default function ForgotPassword() {
  const { forgotUserPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const error = getForgotPasswordError(email);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setGeneralError('');
    setFieldErrors({});
    if (error || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = await forgotUserPassword({ email: email.trim() });
      setMessage(payload?.message || 'إذا كان هناك حساب مستخدم مرتبط بهذا البريد، فسيتم إرسال رابط استعادة كلمة المرور.');
      setSent(true);
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setGeneralError(getErrorMessage(requestError, 'تعذر إرسال طلب الاستعادة. حاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-form auth-state-card">
        <span className="auth-state-icon"><AuthIcon name="mail" size={27}/></span>
        <span className="auth-kicker">تم استلام الطلب</span>
        <h1>تحقق من بريدك</h1>
        <p>{message}</p>
        <div className="auth-info-row"><AuthIcon name="shield" size={17}/><span>لأمان حسابك، لا يتم تغيير كلمة المرور إلا بعد فتح رابط الاستعادة الصحيح وإكمال العملية.</span></div>
        <Link className="auth-primary-btn" to={PATHS.LOGIN}>العودة لتسجيل الدخول <AuthIcon name="arrow" size={18}/></Link>
        <button className="auth-inline-action" type="button" onClick={() => { setSent(false); setSubmitted(false); }}>استخدام بريد آخر</button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading">
        <span className="auth-kicker"><AuthIcon name="lock" size={14}/> استعادة كلمة المرور</span>
        <h1>نساعدك على العودة</h1>
        <p>أدخل بريد حسابك وسنرسل تعليمات الاستعادة إذا كان الحساب مؤهلًا.</p>
      </div>

      <div className="auth-context-note"><AuthIcon name="shield" size={16}/><span><b>خصوصيتك أولًا</b> ستظهر نفس رسالة التأكيد سواء كان البريد مسجلًا أم لا.</span></div>
      <AuthApiAlert message={generalError} />

      <AuthInput id="forgot-email" label="البريد الإلكتروني" icon="mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setGeneralError(''); setFieldErrors({}); }} placeholder="name@example.com" autoComplete="email" error={submitted ? (error || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')} />
      <button className="auth-primary-btn auth-submit-gap" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ الإرسال...</> : <>إرسال تعليمات الاستعادة <AuthIcon name="arrow" size={18}/></>}
      </button>
      <p className="auth-switch">تذكرت كلمة المرور؟ <Link to={PATHS.LOGIN}>العودة لتسجيل الدخول</Link></p>
    </form>
  );
}
