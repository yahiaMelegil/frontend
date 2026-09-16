import React, { useState } from 'react';
import AuthIcon from '../AuthIcon/AuthIcon';
import AuthInput from '../AuthInput/AuthInput';
import AuthApiAlert from '../AuthApiAlert/AuthApiAlert';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { EMAIL_PATTERN } from '../../utils/authValidation';

export default function ForgotPasswordModal({ onClose }) {
  const { forgotUserPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const valid = EMAIL_PATTERN.test(email);

  const submit = async () => {
    if (!valid || isSubmitting) return;
    setIsSubmitting(true);
    setGeneralError('');
    setFieldErrors({});
    try {
      const payload = await forgotUserPassword({ email: email.trim() });
      setMessage(payload?.message || 'إذا كان هناك حساب مستخدم مرتبط بهذا البريد، فسيتم إرسال رابط استعادة كلمة المرور.');
      setSent(true);
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setGeneralError(getErrorMessage(error, 'تعذر إرسال طلب استعادة كلمة المرور.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
        <button className="auth-modal__close" type="button" onClick={onClose} aria-label="إغلاق"><AuthIcon name="close"/></button>
        {!sent ? (
          <>
            <span className="auth-modal__icon"><AuthIcon name="lock" size={24}/></span>
            <h3 id="forgot-title">استعادة كلمة المرور</h3>
            <p>أدخل بريدك الإلكتروني، وسنرسل تعليمات الاستعادة إذا كان الحساب مؤهلًا.</p>
            <AuthApiAlert message={generalError} />
            <AuthInput
              id="forgot-email"
              label="البريد الإلكتروني"
              icon="mail"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setGeneralError(''); setFieldErrors({}); }}
              placeholder="name@example.com"
              autoComplete="email"
              error={getFirstFieldError(fieldErrors, 'email')}
            />
            <button className="auth-primary-btn" type="button" disabled={!valid || isSubmitting} onClick={submit} aria-busy={isSubmitting}>
              {isSubmitting ? 'جارٍ إرسال التعليمات...' : 'إرسال التعليمات'}
            </button>
          </>
        ) : (
          <div className="auth-modal__success">
            <span><AuthIcon name="check" size={25}/></span>
            <h3>تحقق من بريدك</h3>
            <p>{message}</p>
            <button className="auth-secondary-btn" type="button" onClick={onClose}>العودة لتسجيل الدخول</button>
          </div>
        )}
      </div>
    </div>
  );
}
