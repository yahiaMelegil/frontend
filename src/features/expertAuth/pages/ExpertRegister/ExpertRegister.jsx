import { Link, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import AuthApiAlert from '../../../auth/components/AuthApiAlert/AuthApiAlert';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';
import AuthInput from '../../../auth/components/AuthInput/AuthInput';
import PasswordToggle from '../../../auth/components/PasswordToggle/PasswordToggle';
import ExpertSelect from '../../components/ExpertSelect/ExpertSelect';
import { getErrorMessage, getFieldErrors, getFirstFieldError } from '../../../../api/errorHandler';
import useAuth from '../../../../hooks/useAuth';
import { getExpertRegisterErrors, getPasswordStrength } from '../../utils/expertAuthValidation';
import { PATHS } from '../../../../routes/paths';

export default function ExpertRegister() {
  const navigate = useNavigate();
  const { registerExpert } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [domain, setDomain] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [professionalDeclaration, setProfessionalDeclaration] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const errors = useMemo(() => getExpertRegisterErrors({
    name,
    email,
    country,
    language,
    domain,
    password,
    confirm,
    terms,
    professionalDeclaration,
  }), [name, email, country, language, domain, password, confirm, terms, professionalDeclaration]);

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
      const payload = await registerExpert({
        name: name.trim(),
        email: email.trim(),
        country,
        language,
        domain,
        password,
        password_confirmation: confirm,
      });
      navigate(`${PATHS.EXPERT_VERIFY_EMAIL}?email=${encodeURIComponent(email.trim())}`, {
        replace: true,
        state: { message: payload?.message || '' },
      });
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setGeneralError(getErrorMessage(error, 'تعذر إنشاء حساب الخبير. راجع البيانات وحاول مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form expert-auth-form expert-auth-form--register" onSubmit={onSubmit} noValidate>
      <div className="auth-form__heading expert-auth-form__heading">
        <span className="expert-auth-kicker"><AuthIcon name="nodes" size={14}/> حساب خبير جديد</span>
        <h1>ابدأ دورك المهني</h1>
        <p>أنشئ حساب الخبير، ثم أكمل التحقق المهني قبل نشر أي خدمة أو نطاق خبرة.</p>
      </div>

      <div className="expert-auth-context-note expert-auth-context-note--compact"><AuthIcon name="user" size={16}/><span><b>لديك حساب على المنصة؟</b> استخدم نفس البريد لربط دور الخبير بهويتك بدل إنشاء هوية منفصلة.</span></div>
      <AuthApiAlert message={generalError} />

      <div className="expert-auth-register-grid">
        <AuthInput id="expert-register-name" label="الاسم الكامل" icon="user" value={name} onChange={(e) => { setName(e.target.value); clearServerErrors(); }} placeholder="الاسم كما سيظهر في طلب التحقق" autoComplete="name" error={submitted ? (errors.name || getFirstFieldError(fieldErrors, 'name')) : getFirstFieldError(fieldErrors, 'name')} />
        <AuthInput id="expert-register-email" label="البريد الإلكتروني" icon="mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearServerErrors(); }} placeholder="name@example.com" autoComplete="email" error={submitted ? (errors.email || getFirstFieldError(fieldErrors, 'email')) : getFirstFieldError(fieldErrors, 'email')} />
        <ExpertSelect id="expert-register-country" label="بلد الممارسة" icon="shield" value={country} onChange={(e) => { setCountry(e.target.value); clearServerErrors(); }} error={submitted ? (errors.country || getFirstFieldError(fieldErrors, 'country')) : getFirstFieldError(fieldErrors, 'country')}>
          <option value="">اختر البلد</option>
          <option value="jo">الأردن</option>
          <option value="ps">فلسطين</option>
          <option value="us">الولايات المتحدة</option>
          <option value="other">بلد آخر</option>
        </ExpertSelect>
        <ExpertSelect id="expert-register-language" label="لغة العمل الأساسية" icon="nodes" value={language} onChange={(e) => { setLanguage(e.target.value); clearServerErrors(); }} error={submitted ? (errors.language || getFirstFieldError(fieldErrors, 'language')) : getFirstFieldError(fieldErrors, 'language')}>
          <option value="">اختر اللغة</option>
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="ar-en">العربية وEnglish</option>
        </ExpertSelect>
        <div className="expert-auth-grid-span-2">
          <ExpertSelect id="expert-register-domain" label="المجال المهني الرئيسي" icon="nodes" value={domain} onChange={(e) => { setDomain(e.target.value); clearServerErrors(); }} error={submitted ? (errors.domain || getFirstFieldError(fieldErrors, 'domain')) : getFirstFieldError(fieldErrors, 'domain')}>
            <option value="">اختر مجال خبرتك الرئيسي</option>
            <option value="legal">قانون واستشارات قانونية</option>
            <option value="technology">تقنية وبرمجيات</option>
            <option value="finance">مالية ومحاسبة</option>
            <option value="business">أعمال وتشغيل</option>
            <option value="engineering">هندسة وعقار</option>
            <option value="career">مسار مهني وموارد بشرية</option>
            <option value="other">مجال آخر</option>
          </ExpertSelect>
        </div>
        <AuthInput id="expert-register-password" label="كلمة المرور" icon="lock" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearServerErrors(); }} placeholder="8 أحرف أو أكثر" autoComplete="new-password" error={submitted ? (errors.password || getFirstFieldError(fieldErrors, 'password')) : getFirstFieldError(fieldErrors, 'password')} endAction={<PasswordToggle visible={showPassword} onClick={() => setShowPassword((value) => !value)} label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} />} />
        <AuthInput id="expert-register-confirm" label="تأكيد كلمة المرور" icon="lock" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); clearServerErrors(); }} placeholder="أعد كتابة كلمة المرور" autoComplete="new-password" error={submitted ? (errors.confirm || getFirstFieldError(fieldErrors, 'password_confirmation')) : getFirstFieldError(fieldErrors, 'password_confirmation')} endAction={<PasswordToggle visible={showConfirm} onClick={() => setShowConfirm((value) => !value)} label={showConfirm ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'} />} />
      </div>

      {password && (
        <div className="auth-strength expert-auth-strength" aria-label="قوة كلمة المرور">
          <div className="auth-strength__bars">{[1, 2, 3, 4].map((number) => <i key={number} className={number <= strength ? 'is-on' : ''}/>)}</div>
          <span>{strength <= 1 ? 'ضعيفة' : strength === 2 ? 'متوسطة' : strength === 3 ? 'جيدة' : 'قوية'}</span>
        </div>
      )}

      <div className="expert-auth-declarations">
        <label className={`auth-check auth-check--terms ${submitted && errors.professionalDeclaration ? 'auth-check--error' : ''}`}>
          <input type="checkbox" checked={professionalDeclaration} onChange={(e) => setProfessionalDeclaration(e.target.checked)} />
          <span>أقر أن المعلومات المهنية ستخضع للتحقق وأن إنشاء الحساب لا يعني نشر ملفي أو اعتماد خدماتي.</span>
        </label>
        {submitted && errors.professionalDeclaration && <small className="auth-error">{errors.professionalDeclaration}</small>}

        <label className={`auth-check auth-check--terms ${submitted && errors.terms ? 'auth-check--error' : ''}`}>
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>أوافق على <a href="#terms">الشروط والأحكام</a> و<a href="#privacy">سياسة الخصوصية</a>.</span>
        </label>
        {submitted && errors.terms && <small className="auth-error">{errors.terms}</small>}
      </div>

      <button className="auth-primary-btn expert-auth-primary-btn" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <><span className="auth-button-spinner" aria-hidden="true" /> جارٍ إنشاء الحساب...</> : <>إنشاء حساب الخبير <AuthIcon name="arrow" size={18}/></>}
      </button>
      <p className="auth-switch expert-auth-register-switch">لديك حساب خبير بالفعل؟ <Link to={PATHS.EXPERT_LOGIN}>تسجيل الدخول</Link></p>
    </form>
  );
}
