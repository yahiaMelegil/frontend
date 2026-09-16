import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AuthApiAlert from '../../../auth/components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import { getErrorMessage } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { PATHS } from '../../../../routes/paths';

export default function ExpertEmailVerification() {
  const { id, hash } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resendExpertVerification, verifyExpertEmail, sessions } = useAuth();
  const email = searchParams.get('email') || 'بريدك الإلكتروني';
  const isCallback = Boolean(id && hash);
  const canResend = sessions.expert.isAuthenticated;
  const [isVerifying, setIsVerifying] = useState(isCallback);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState(location.state?.message || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCallback) return undefined;
    let active = true;

    const verify = async () => {
      setIsVerifying(true);
      setError('');
      try {
        const payload = await verifyExpertEmail(id, hash, location.search);
        if (!active) return;
        navigate(PATHS.EXPERT_EMAIL_VERIFIED, {
          replace: true,
          state: { message: payload?.message || '' },
        });
      } catch (requestError) {
        if (!active) return;
        setError(getErrorMessage(requestError, 'تعذر التحقق من بريد الخبير.'));
        setIsVerifying(false);
      }
    };

    verify();
    return () => { active = false; };
  }, [hash, id, isCallback, location.search, navigate, verifyExpertEmail]);

  const resend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError('');
    setMessage('');
    try {
      const payload = await resendExpertVerification();
      setMessage(payload?.message || 'تم إرسال رابط التحقق من البريد الإلكتروني بنجاح.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'تعذر إعادة إرسال رابط التحقق.'));
    } finally {
      setIsResending(false);
    }
  };

  if (isCallback && isVerifying) {
    return (
      <div className="auth-form expert-auth-form expert-auth-state-card expert-auth-state-card--verify">
        <div className="expert-auth-mail-visual" aria-hidden="true"><span><AuthIcon name="mail" size={31}/></span></div>
        <span className="expert-auth-kicker">تأكيد البريد الإلكتروني</span>
        <h1>جارٍ التحقق من الرابط</h1>
        <p>يتم الآن التحقق من رابط بريد الخبير مع الخادم.</p>
      </div>
    );
  }

  if (isCallback && error) {
    return (
      <div className="auth-form expert-auth-form expert-auth-state-card expert-auth-state-card--verify">
        <span className="expert-auth-state-icon"><AuthIcon name="mail" size={27}/></span>
        <span className="expert-auth-kicker">تعذر التحقق</span>
        <h1>الرابط غير صالح أو منتهي الصلاحية</h1>
        <AuthApiAlert message={error} />
        {canResend ? (
          <button className="auth-secondary-btn expert-auth-secondary-btn" type="button" onClick={resend} disabled={isResending}>
            {isResending ? 'جارٍ إرسال رابط جديد...' : 'إرسال رابط تحقق جديد'}
          </button>
        ) : (
          <Link className="auth-secondary-btn expert-auth-secondary-btn" to={PATHS.EXPERT_LOGIN}>تسجيل الدخول لطلب رابط جديد</Link>
        )}
        <p className="auth-switch">تحتاج إلى تسجيل الدخول؟ <Link to={PATHS.EXPERT_LOGIN}>العودة لتسجيل الدخول</Link></p>
      </div>
    );
  }

  return (
    <div className="auth-form expert-auth-form expert-auth-state-card expert-auth-state-card--verify">
      <div className="expert-auth-mail-visual" aria-hidden="true">
        <span><AuthIcon name="mail" size={31}/></span>
        <i className="expert-auth-mail-pulse expert-auth-mail-pulse--1" />
        <i className="expert-auth-mail-pulse expert-auth-mail-pulse--2" />
      </div>
      <span className="expert-auth-kicker">تأكيد البريد الإلكتروني</span>
      <h1>راجع صندوق الوارد</h1>
      <p>أرسلنا رابط تحقق إلى <strong>{email}</strong>. افتح الرابط لإكمال تأكيد وسيلة التواصل الخاصة بحساب الخبير.</p>

      <AuthApiAlert message={message} tone="success" />
      <AuthApiAlert message={error} />

      <div className="expert-auth-verification-list">
        <span><i>1</i><b>افتح رسالة التحقق</b><small>الرابط مخصص للحساب ولمدة محدودة.</small></span>
        <span><i>2</i><b>اضغط تأكيد البريد</b><small>لن ينشر ذلك ملفك المهني.</small></span>
        <span><i>3</i><b>أكمل ملف الخبير</b><small>بعد التحقق تنتقل لمسار الانضمام المهني.</small></span>
      </div>

      <button className="auth-secondary-btn expert-auth-secondary-btn" type="button" onClick={resend} disabled={isResending}>
        {isResending ? 'جارٍ إرسال رابط جديد...' : 'إعادة إرسال رابط التحقق'}
      </button>
      <p className="auth-switch">كتبت البريد بشكل خاطئ؟ <Link to={PATHS.EXPERT_REGISTER}>العودة للتسجيل</Link></p>
    </div>
  );
}
