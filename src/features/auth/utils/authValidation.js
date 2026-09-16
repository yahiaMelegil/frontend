export const EMAIL_PATTERN = /\S+@\S+\.\S+/;

export function getLoginErrors({ email, password }) {
  return {
    email: !email ? 'أدخل بريدك الإلكتروني.' : (!EMAIL_PATTERN.test(email) ? 'أدخل بريدًا إلكترونيًا صالحًا.' : ''),
    password: !password ? 'أدخل كلمة المرور.' : '',
  };
}

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Zأ-ي]/.test(password) && /[a-zأ-ي]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9أ-ي]/.test(password)) score += 1;
  return score;
}

export function getRegisterErrors({ name, email, password, confirm, terms }) {
  return {
    name: !name.trim() ? 'أدخل الاسم الكامل.' : '',
    email: !email ? 'أدخل بريدك الإلكتروني.' : (!EMAIL_PATTERN.test(email) ? 'أدخل بريدًا إلكترونيًا صالحًا.' : ''),
    password: !password ? 'أنشئ كلمة مرور.' : (password.length < 8 ? 'استخدم 8 أحرف على الأقل.' : ''),
    confirm: !confirm ? 'أعد كتابة كلمة المرور.' : (confirm !== password ? 'كلمتا المرور غير متطابقتين.' : ''),
    terms: !terms ? 'يجب الموافقة على الشروط وسياسة الخصوصية.' : '',
  };
}


export function getForgotPasswordError(email) {
  if (!email) return 'أدخل بريدك الإلكتروني.';
  if (!EMAIL_PATTERN.test(email)) return 'أدخل بريدًا إلكترونيًا صالحًا.';
  return '';
}

export function getResetPasswordErrors({ password, confirm }) {
  return {
    password: !password ? 'أدخل كلمة المرور الجديدة.' : (password.length < 8 ? 'استخدم 8 أحرف على الأقل.' : ''),
    confirm: !confirm ? 'أعد كتابة كلمة المرور.' : (confirm !== password ? 'كلمتا المرور غير متطابقتين.' : ''),
  };
}
