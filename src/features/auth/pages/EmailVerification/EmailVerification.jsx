import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AuthApiAlert from '../../components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import { getErrorMessage } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { PATHS } from '../../../../routes/paths';

export default function EmailVerification() {
  const { id, hash } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resendUserVerification, verifyUserEmail, sessions } = useAuth();
  const email = searchParams.get('email') || 'بريدك الإلكتروني';
  const isCallback = Boolean(id && hash);
  const canResend = sessions.user.isAuthenticated;
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
        const payload = await verifyUserEmail(id, hash, location.search);
        if (!active) return;
        navigate(PATHS.EMAIL_VERIFIED, {
          replace: true,
          state: { message: payload?.message || '' },
        });
      } catch (requestError) {
        if (!active) return;
        setError(getErrorMessage(requestError, 'تعذر التحقق من البريد الإلكتروني.'));
        setIsVerifying(false);
      }
    };

    verify();
    return () => { active = false; };
  }, [hash, id, isCallback, location.search, navigate, verifyUserEmail]);

  const resend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError('');
    setMessage('');
    try {
      const payload = await resendUserVerification();
      setMessage(payload?.message || 'تم إرسال رابط التحقق من البريد الإلكتروني بنجاح.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'تعذر إعادة إرسال رابط التحقق.'));
    } finally {
      setIsResending(false);
    }
  };

  if (isCallback && isVerifying) {
    return (
      <div className="auth-form auth-state-card auth-state-card--verify">
        <div className="auth-mail-visual" aria-hidden="true"><span><AuthIcon name="mail" size={31}/></span></div>
        <span className="auth-kicker">تأكيد البريد الإلكتروني</span>
        <h1>جارٍ التحقق من الرابط</h1>
        <p>يتم الآن التحقق من الرابط مع الخادم. لا تغلق الصفحة حتى تكتمل العملية.</p>
      </div>
    );
  }

  if (isCallback && error) {
    return (
      <div className="auth-form auth-state-card auth-state-card--verify">
        <span className="auth-state-icon"><AuthIcon name="mail" size={27}/></span>
        <span className="auth-kicker">تعذر التحقق</span>
        <h1>الرابط غير صالح أو منتهي الصلاحية</h1>
        <AuthApiAlert message={error} />
        {canResend ? (
          <button className="auth-secondary-btn auth-secondary-state-btn" type="button" onClick={resend} disabled={isResending}>
            {isResending ? 'جارٍ إرسال رابط جديد...' : 'إرسال رابط تحقق جديد'}
          </button>
        ) : (
          <Link className="auth-secondary-btn auth-secondary-state-btn" to={PATHS.LOGIN}>تسجيل الدخول لطلب رابط جديد</Link>
        )}
        <p className="auth-switch">تحتاج إلى تسجيل الدخول؟ <Link to={PATHS.LOGIN}>العودة لتسجيل الدخول</Link></p>
      </div>
    );
  }

  return (
    <div className="auth-form auth-state-card auth-state-card--verify">
      <div className="auth-mail-visual" aria-hidden="true">
        <span><AuthIcon name="mail" size={31}/></span>
        <i className="auth-mail-pulse auth-mail-pulse--1" />
        <i className="auth-mail-pulse auth-mail-pulse--2" />
      </div>
      <span className="auth-kicker">تأكيد البريد الإلكتروني</span>
      <h1>راجع صندوق الوارد</h1>
      <p>أرسلنا رابط تحقق إلى <strong>{email}</strong>. افتح الرابط لتأكيد بريدك الإلكتروني وإكمال تفعيل حسابك.</p>

      <AuthApiAlert message={message} tone="success" />
      <AuthApiAlert message={error} />

      <div className="auth-verification-list">
        <span><i>1</i><b>افتح رسالة التحقق</b><small>الرابط مخصص لحسابك ولمدة محدودة.</small></span>
        <span><i>2</i><b>اضغط تأكيد البريد</b><small>سنؤكد وسيلة التواصل المرتبطة بالحساب.</small></span>
        <span><i>3</i><b>ارجع إلى حسابك</b><small>بعد التحقق يمكنك متابعة استخدام المنصة بشكل طبيعي.</small></span>
      </div>

      <button className="auth-secondary-btn auth-secondary-state-btn" type="button" onClick={resend} disabled={isResending}>
        {isResending ? 'جارٍ إرسال رابط جديد...' : 'إعادة إرسال رابط التحقق'}
      </button>
      <p className="auth-switch">كتبت البريد بشكل خاطئ؟ <Link to={PATHS.REGISTER}>العودة للتسجيل</Link></p>
    </div>
  );
}
