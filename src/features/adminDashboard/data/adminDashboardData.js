import { PATHS } from '../../../routes/paths';

export const sidebarGroups = [
  {
    labelKey: 'sidebar.groups.workspace',
    items: [
      { id: 'overview', labelKey: 'sidebar.items.overview', icon: 'dashboard', path: PATHS.ADMIN_DASHBOARD },
      { id: 'cases', labelKey: 'sidebar.items.cases', icon: 'case', badge: '24', path: PATHS.ADMIN_CASES },
      { id: 'experts', labelKey: 'sidebar.items.experts', icon: 'verified', badge: '18', path: PATHS.ADMIN_EXPERTS },
      { id: 'kyc', labelKey: 'sidebar.items.kyc', icon: 'verified', badge: '3', path: PATHS.ADMIN_KYC },
      { id: 'users', labelKey: 'sidebar.items.users', icon: 'users', path: PATHS.ADMIN_USERS },
    ],
  },
  {
    labelKey: 'sidebar.groups.trust',
    items: [
      { id: 'complaints', labelKey: 'sidebar.items.complaints', icon: 'flag', badge: '7', tone: 'warning', path: PATHS.ADMIN_COMPLAINTS },
      { id: 'risk', labelKey: 'sidebar.items.risk', icon: 'risk', badge: '3', tone: 'danger', path: PATHS.ADMIN_RISK },
      { id: 'disputes', labelKey: 'sidebar.items.disputes', icon: 'scale', badge: '12', path: PATHS.ADMIN_DISPUTES },
    ],
  },
  {
    labelKey: 'sidebar.groups.platform',
    items: [
      { id: 'policies', labelKey: 'sidebar.items.policies', icon: 'policy', path: PATHS.ADMIN_POLICIES },
      { id: 'audit', labelKey: 'sidebar.items.audit', icon: 'audit', path: PATHS.ADMIN_AUDIT },
      { id: 'roles', labelKey: 'sidebar.items.roles', icon: 'lock', path: PATHS.ADMIN_ROLES },
      { id: 'subadmins', labelKey: 'sidebar.items.subadmins', icon: 'userCheck', path: PATHS.ADMIN_SUB_ADMINS },
      { id: 'settings', labelKey: 'sidebar.items.settings', icon: 'settings', path: PATHS.ADMIN_SETTINGS },
    ],
  },
];

export const dashboardMetrics = [
  {
    id: 'verification',
    label: 'طلبات تحقق تنتظر القرار',
    value: '18',
    helper: '5 طلبات تجاوزت وقت المراجعة',
    change: '+4 اليوم',
    icon: 'verified',
    tone: 'olive',
    points: [28, 35, 31, 45, 41, 55, 59],
  },
  {
    id: 'complaints',
    label: 'شكاوى سلوك مفتوحة',
    value: '7',
    helper: '2 تتطلب مراجعة خلال ساعتين',
    change: 'مستقر',
    icon: 'flag',
    tone: 'peach',
    points: [48, 43, 51, 42, 45, 38, 39],
  },
  {
    id: 'risk',
    label: 'إشارات مرتفعة الخطورة',
    value: '3',
    helper: 'لا يوجد إجراء آلي غير قابل للعكس',
    change: '-2 هذا الأسبوع',
    icon: 'risk',
    tone: 'danger',
    points: [62, 56, 53, 49, 44, 40, 35],
  },
  {
    id: 'disputes',
    label: 'نزاعات قيد المعالجة',
    value: '12',
    helper: '4 بانتظار مراجع مستقل',
    change: '67% ضمن المهلة',
    icon: 'scale',
    tone: 'earth',
    points: [33, 41, 38, 46, 52, 48, 54],
  },
];

export const reviewQueue = [
  {
    id: 'VR-2048',
    type: 'تحقق خبير',
    title: 'طلب اعتماد نطاق مهني جديد',
    description: 'قانون تجاري · فلسطين',
    icon: 'verified',
    priority: 'مرتفع',
    status: 'قيد المراجعة',
    age: 'منذ 46 دقيقة',
    owner: 'فريق التحقق',
  },
  {
    id: 'TS-1187',
    type: 'شكوى سلوك',
    title: 'بلاغ يحتاج فرزًا أوليًا عاجلًا',
    description: 'الأدلة متاحة للموظف المكلّف فقط',
    icon: 'flag',
    priority: 'عاجل',
    status: 'يتطلب إجراء',
    age: 'منذ 1 س و12 د',
    owner: 'الثقة والسلامة',
  },
  {
    id: 'RF-0731',
    type: 'مراجعة مخاطر',
    title: 'نمط تقييمات مترابطة يحتاج تحققًا',
    description: 'التقييمات مخفية مؤقتًا أثناء المراجعة',
    icon: 'risk',
    priority: 'مرتفع',
    status: 'مراقبة',
    age: 'منذ ساعتين',
    owner: 'عمليات المخاطر',
  },
  {
    id: 'AP-0329',
    type: 'استئناف قيد',
    title: 'معلومات جديدة أضيفت إلى الاستئناف',
    description: 'يتطلب مراجعًا مختلفًا عن صاحب القرار',
    icon: 'appeal',
    priority: 'متوسط',
    status: 'بانتظار التعيين',
    age: 'منذ 4 ساعات',
    owner: 'إدارة الحسابات',
  },
  {
    id: 'DS-0914',
    type: 'نزاع خدمة',
    title: 'نطاق التسليم يحتاج مراجعة مستقلة',
    description: 'الأموال معلّقة لحين القرار الموثق',
    icon: 'scale',
    priority: 'متوسط',
    status: 'قيد المراجعة',
    age: 'منذ 6 ساعات',
    owner: 'حل النزاعات',
  },
];

export const queueFilters = [
  { id: 'all', label: 'الكل' },
  { id: 'urgent', label: 'عاجل' },
  { id: 'verification', label: 'التحقق' },
  { id: 'trust', label: 'الثقة والسلامة' },
];

export const operationalTrend = [
  { label: 'السبت', opened: 18, resolved: 14 },
  { label: 'الأحد', opened: 23, resolved: 19 },
  { label: 'الاثنين', opened: 17, resolved: 22 },
  { label: 'الثلاثاء', opened: 26, resolved: 21 },
  { label: 'الأربعاء', opened: 21, resolved: 24 },
  { label: 'الخميس', opened: 29, resolved: 25 },
  { label: 'الجمعة', opened: 16, resolved: 20 },
];

export const systemHealth = [
  { id: 'api', label: 'واجهات المنصة', detail: 'زمن الاستجابة 184ms', value: '99.98%', status: 'مستقر' },
  { id: 'realtime', label: 'التنبيهات الفورية', detail: 'لا توجد رسائل متأخرة', value: '99.95%', status: 'مستقر' },
  { id: 'files', label: 'فحص المستندات', detail: 'ملفان في طابور الفحص', value: 'طبيعي', status: 'طبيعي' },
];

export const auditEvents = [
  {
    id: 'AE-8841',
    action: 'تم نشر الإصدار 3.2 من سياسة النزاعات',
    actor: 'مالك المنصة',
    time: 'منذ 18 دقيقة',
    icon: 'policy',
    tone: 'olive',
  },
  {
    id: 'AE-8838',
    action: 'تم تقييد نطاق خدمة محدد بعد مراجعة بشرية',
    actor: 'مدير مخوّل',
    time: 'منذ 52 دقيقة',
    icon: 'lock',
    tone: 'peach',
  },
  {
    id: 'AE-8832',
    action: 'رُفض طلب وصول أوسع من المهمة المسندة',
    actor: 'نظام الصلاحيات',
    time: 'منذ ساعتين',
    icon: 'shield',
    tone: 'earth',
  },
  {
    id: 'AE-8824',
    action: 'أُعيدت حالة مخاطر إلى الوضع الطبيعي بعد التحقق',
    actor: 'مسؤول الثقة والسلامة',
    time: 'منذ 3 ساعات',
    icon: 'check',
    tone: 'olive',
  },
];

export const quickActions = [
  { id: 'verification', label: 'مراجعة طلبات التحقق', helper: '18 طلبًا', icon: 'verified' },
  { id: 'complaints', label: 'فتح طابور الشكاوى', helper: '2 عاجلة', icon: 'flag' },
  { id: 'policy', label: 'إنشاء إصدار سياسة', helper: 'يتطلب موافقة', icon: 'policy' },
  { id: 'access', label: 'مراجعة وصول الإدارة', helper: 'سجل دائم', icon: 'audit' },
];

export const notifications = [
  { id: 1, titleKey: 'notifications.verificationOverdue', timeKey: 'notifications.minutesAgo8', tone: 'warning' },
  { id: 2, titleKey: 'notifications.newRiskSignal', timeKey: 'notifications.minutesAgo22', tone: 'danger' },
  { id: 3, titleKey: 'notifications.privacyPublished', timeKey: 'notifications.hourAgo', tone: 'success' },
];
