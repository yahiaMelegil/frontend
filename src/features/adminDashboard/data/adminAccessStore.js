export const permissionCatalog = [
  { id: 'dashboard.view', group: 'عام', label: 'عرض لوحة الإدارة', description: 'الوصول إلى النظرة العامة والملخصات التشغيلية.' },
  { id: 'cases.view', group: 'الحالات', label: 'عرض الحالات التشغيلية', description: 'رؤية بيانات الحالة التشغيلية دون فتح المحتوى الحساس.' },
  { id: 'kyc.review', group: 'توثيق الخبراء', label: 'مراجعة طلبات KYC', description: 'فتح مستندات التحقق المصرح بها واتخاذ قرار قبول أو رفض.', sensitive: true },
  { id: 'users.manage', group: 'الحسابات', label: 'إدارة حسابات المستخدمين', description: 'مراجعة الحسابات والقيود المحددة النطاق.' },
  { id: 'complaints.review', group: 'الثقة والسلامة', label: 'مراجعة الشكاوى', description: 'الوصول إلى الشكاوى المسندة واتخاذ الإجراءات المسموحة.' },
  { id: 'risk.review', group: 'الثقة والسلامة', label: 'مراجعة المخاطر', description: 'فحص إشارات المخاطر وإحالتها أو إغلاقها.' },
  { id: 'disputes.review', group: 'النزاعات والمالية', label: 'مراجعة النزاعات', description: 'الوصول إلى النزاعات والأدلة المصرح بها.' },
  { id: 'policies.manage', group: 'إدارة المنصة', label: 'إدارة السياسات', description: 'إنشاء ومراجعة إصدارات السياسات التشغيلية.', sensitive: true },
  { id: 'audit.view', group: 'إدارة المنصة', label: 'عرض سجل التدقيق', description: 'قراءة أحداث التدقيق ضمن النطاق المسموح.' },
  { id: 'roles.manage', group: 'إدارة المنصة', label: 'إدارة الأدوار والصلاحيات', description: 'إنشاء Roles وتحديد Permissions الخاصة بها.', sensitive: true },
  { id: 'subadmins.manage', group: 'إدارة المنصة', label: 'إدارة Sub-Admins', description: 'إنشاء حسابات إدارية فرعية وتعيين Role لها.', sensitive: true },
  { id: 'settings.manage', group: 'إدارة المنصة', label: 'إعدادات المنصة', description: 'تعديل الإعدادات التشغيلية العامة.', sensitive: true },
];

const ALL_PERMISSION_IDS = permissionCatalog.map((permission) => permission.id);

export const defaultAdminRoles = [
  {
    id: 'owner',
    name: 'Super Admin',
    description: 'صلاحيات المنصة الكاملة، بما فيها إدارة الأدوار والحسابات الإدارية.',
    protected: true,
    permissions: ALL_PERMISSION_IDS,
  },
  {
    id: 'verification-reviewer',
    name: 'مراجع KYC',
    description: 'مراجعة طلبات توثيق الخبراء والأدلة المرتبطة بها فقط.',
    permissions: ['dashboard.view', 'kyc.review', 'audit.view'],
  },
  {
    id: 'trust-safety',
    name: 'الثقة والسلامة',
    description: 'الشكاوى والمخاطر والنزاعات ضمن المهام المسندة.',
    permissions: ['dashboard.view', 'complaints.review', 'risk.review', 'disputes.review', 'audit.view'],
  },
  {
    id: 'operations-admin',
    name: 'مدير العمليات',
    description: 'الحالات والحسابات والتشغيل اليومي دون صلاحيات إدارة النظام الحساسة.',
    permissions: ['dashboard.view', 'cases.view', 'users.manage', 'audit.view'],
  },
];

export const defaultSubAdmins = [
  { id: 'ADM-102', name: 'ليان محمود', email: 'layan@platform.example', roleId: 'verification-reviewer', status: 'نشط', lastActive: 'قبل 12 دقيقة' },
  { id: 'ADM-097', name: 'سامر خليل', email: 'samer@platform.example', roleId: 'trust-safety', status: 'نشط', lastActive: 'قبل ساعة' },
  { id: 'ADM-091', name: 'رنا سليم', email: 'rana@platform.example', roleId: 'operations-admin', status: 'دعوة معلّقة', lastActive: 'لم يسجل الدخول بعد' },
];

const ROLES_KEY = 'hala_admin_rbac_roles_v1';
const ADMINS_KEY = 'hala_sub_admins_v1';

function safeRead(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Preview data can continue in memory if storage is unavailable.
  }
}

export function getAdminRoles() {
  const stored = safeRead(ROLES_KEY, null);
  return Array.isArray(stored) && stored.length ? stored : defaultAdminRoles;
}

export function saveAdminRoles(roles) {
  safeWrite(ROLES_KEY, roles);
}

export function getSubAdmins() {
  const stored = safeRead(ADMINS_KEY, null);
  return Array.isArray(stored) ? stored : defaultSubAdmins;
}

export function saveSubAdmins(admins) {
  safeWrite(ADMINS_KEY, admins);
}
