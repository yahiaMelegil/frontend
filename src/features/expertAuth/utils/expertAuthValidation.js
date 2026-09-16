import { EMAIL_PATTERN, getPasswordStrength } from '../../auth/utils/authValidation';

export { getPasswordStrength };

export function getExpertLoginErrors({ email, password }) {
  return {
    email: !email ? 'أدخل بريدك الإلكتروني.' : (!EMAIL_PATTERN.test(email) ? 'أدخل بريدًا إلكترونيًا صالحًا.' : ''),
    password: !password ? 'أدخل كلمة المرور.' : '',
  };
}

export function getExpertRegisterErrors({
  name,
  email,
  country,
  language,
  domain,
  password,
  confirm,
  terms,
  professionalDeclaration,
}) {
  return {
    name: !name.trim() ? 'أدخل الاسم الكامل.' : '',
    email: !email ? 'أدخل بريدك الإلكتروني.' : (!EMAIL_PATTERN.test(email) ? 'أدخل بريدًا إلكترونيًا صالحًا.' : ''),
    country: !country ? 'اختر بلد الممارسة.' : '',
    language: !language ? 'اختر لغة العمل الأساسية.' : '',
    domain: !domain ? 'اختر المجال المهني الرئيسي.' : '',
    password: !password ? 'أنشئ كلمة مرور.' : (password.length < 8 ? 'استخدم 8 أحرف على الأقل.' : ''),
    confirm: !confirm ? 'أعد كتابة كلمة المرور.' : (confirm !== password ? 'كلمتا المرور غير متطابقتين.' : ''),
    terms: !terms ? 'يجب الموافقة على الشروط وسياسة الخصوصية.' : '',
    professionalDeclaration: !professionalDeclaration ? 'يجب الإقرار بصحة المعلومات المهنية ومسار التحقق.' : '',
  };
}

export function getExpertForgotPasswordError(email) {
  if (!email) return 'أدخل بريدك الإلكتروني.';
  if (!EMAIL_PATTERN.test(email)) return 'أدخل بريدًا إلكترونيًا صالحًا.';
  return '';
}

export function getExpertResetPasswordErrors({ password, confirm }) {
  return {
    password: !password ? 'أدخل كلمة المرور الجديدة.' : (password.length < 8 ? 'استخدم 8 أحرف على الأقل.' : ''),
    confirm: !confirm ? 'أعد كتابة كلمة المرور.' : (confirm !== password ? 'كلمتا المرور غير متطابقتين.' : ''),
  };
}
