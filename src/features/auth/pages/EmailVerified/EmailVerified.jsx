import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthIcon from '../../components/AuthIcon/AuthIcon';
import { PATHS } from '../../../../routes/paths';

export default function EmailVerified() {
  const location = useLocation();
  const message = location.state?.message || 'تم تأكيد وسيلة التواصل المرتبطة بحسابك. يمكنك الآن تسجيل الدخول والوصول إلى حالاتك ومساحة عملك.';

  return (
    <div className="auth-form auth-state-card auth-state-card--verified">
      <div className="auth-success-ring" aria-hidden="true">
        <span><AuthIcon name="check" size={36}/></span>
        <i/><i/><i/>
      </div>
      <span className="auth-kicker">تم التحقق بنجاح</span>
      <h1>تم تأكيد بريدك الإلكتروني</h1>
      <p>{message}</p>

      <div className="auth-next-step">
        <span><AuthIcon name="nodes" size={19}/></span>
        <div><b>الخطوة التالية</b><small>سجّل الدخول، ثم ابدأ حالة جديدة أو تابع الحالات والاستشارات الموجودة في حسابك.</small></div>
      </div>

      <Link className="auth-primary-btn" to={PATHS.LOGIN}>الانتقال إلى تسجيل الدخول <AuthIcon name="arrow" size={18}/></Link>
      <Link className="auth-inline-link" to={PATHS.HOME}>العودة إلى الصفحة الرئيسية</Link>
    </div>
  );
}
