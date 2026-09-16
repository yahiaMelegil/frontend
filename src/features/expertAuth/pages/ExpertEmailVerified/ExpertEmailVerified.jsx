import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import { PATHS } from '../../../../routes/paths';

export default function ExpertEmailVerified() {
  const location = useLocation();
  const message = location.state?.message || 'أصبحت وسيلة التواصل مؤكدة. يمكنك الآن تسجيل الدخول ومتابعة إعداد دورك المهني ومسار التحقق من الخبرة.';

  return (
    <div className="auth-form expert-auth-form expert-auth-state-card expert-auth-state-card--verified">
      <div className="expert-auth-success-ring" aria-hidden="true">
        <span><AuthIcon name="check" size={36}/></span>
        <i/><i/><i/>
      </div>
      <span className="expert-auth-kicker">تم التحقق بنجاح</span>
      <h1>تم تأكيد بريدك الإلكتروني</h1>
      <p>{message}</p>

      <div className="expert-auth-next-step">
        <span><AuthIcon name="nodes" size={19}/></span>
        <div><b>الخطوة التالية</b><small>استكمال معلومات الخبرة والمؤهلات والنطاق قبل نشر الملف المهني.</small></div>
      </div>

      <Link className="auth-primary-btn expert-auth-primary-btn" to={PATHS.EXPERT_LOGIN}>الانتقال إلى تسجيل دخول الخبير <AuthIcon name="arrow" size={18}/></Link>
      <Link className="expert-auth-inline-link" to={PATHS.HOME}>العودة إلى الصفحة الرئيسية</Link>
    </div>
  );
}
