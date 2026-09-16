import { EMAIL_PATTERN } from '../../auth/utils/authValidation';

export function getAdminLoginErrors({ email, password }) {
  return {
    email: !email ? 'أدخل البريد الإلكتروني الإداري.' : (!EMAIL_PATTERN.test(email) ? 'أدخل بريدًا إلكترونيًا صالحًا.' : ''),
    password: !password ? 'أدخل كلمة المرور.' : '',
  };
}
