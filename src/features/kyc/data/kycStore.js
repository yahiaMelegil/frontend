const STORAGE_KEY = 'solveit_kyc_shared_v1';

export const KYC_STATUS = Object.freeze({
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  NEEDS_INFORMATION: 'needs_information',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

export const KYC_STATUS_META = Object.freeze({
  draft: { ar: 'مسودة', en: 'Draft', tone: 'neutral' },
  submitted: { ar: 'مُقدّم', en: 'Submitted', tone: 'warning' },
  under_review: { ar: 'قيد المراجعة', en: 'Under review', tone: 'review' },
  needs_information: { ar: 'تحتاج معلومات', en: 'Needs information', tone: 'warning' },
  verified: { ar: 'مقبول', en: 'Verified', tone: 'success' },
  rejected: { ar: 'مرفوض', en: 'Rejected', tone: 'danger' },
});

const nowLabel = () => new Intl.DateTimeFormat('ar', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

const makeApplication = ({
  fullName, country = 'ps', language = 'ar', domain, jurisdiction,
  identity = 'identity.pdf', cv = 'cv.pdf', experience = [], qualification = [], credentials = [], samples = [],
}) => ({
  verificationStatus: KYC_STATUS.SUBMITTED,
  identityAndScope: {
    fullName,
    country,
    language,
    domain,
    jurisdiction,
    identityEvidence: identity ? { name: identity, size: 0, type: 'application/pdf' } : null,
  },
  cv: cv ? { name: cv, size: 0, type: 'application/pdf' } : null,
  experiences: experience,
  qualifications: qualification,
  credentials,
  workSamples: samples.map((name) => ({ name, size: 0, type: 'application/pdf' })),
  payoutReadiness: 'not_ready',
});

const SEED_REQUESTS = [
  {
    id: 'KYC-2051', status: KYC_STATUS.SUBMITTED, submittedAt: 'اليوم، 10:18 ص',
    expert: { name: 'م. رائد الخطيب', email: 'raed.k@example.com', phone: '+970 59 555 0182' },
    application: makeApplication({
      fullName: 'م. رائد الخطيب', domain: 'legal', jurisdiction: 'فلسطين', identity: 'national-id.pdf', cv: 'raed-khatib-cv.pdf',
      experience: [{ jobTitle: 'مستشار قانوني', organization: 'مكتب استشارات', from: '2018-01', to: '', current: true, description: 'استشارات قانونية وتجارية.' }],
      qualification: [{ degree: 'ماجستير', field: 'قانون تجاري', institution: 'جامعة محلية', graduationYear: '2018', document: { name: 'master-degree.pdf' } }],
      credentials: [{ type: 'license', name: 'رخصة مزاولة المهنة', issuer: 'جهة مهنية', issueDate: '2019-01-01', expiryDate: '', document: { name: 'professional-license.pdf' } }],
      samples: ['experience-certificates.pdf'],
    }),
  },
  {
    id: 'KYC-2047', status: KYC_STATUS.UNDER_REVIEW, submittedAt: 'اليوم، 8:40 ص',
    expert: { name: 'أ. سارة منصور', email: 'sara.m@example.com', phone: '+962 79 882 1140' },
    application: makeApplication({
      fullName: 'أ. سارة منصور', country: 'jo', domain: 'finance', jurisdiction: 'الأردن', identity: 'passport.pdf', cv: 'sara-cv.pdf',
      experience: [{ jobTitle: 'محللة مالية', organization: 'شركة استشارات', from: '2020-01', to: '', current: true, description: 'تحليل مالي ومحاسبي.' }],
      qualification: [{ degree: 'بكالوريوس', field: 'محاسبة', institution: 'جامعة', graduationYear: '2020', document: { name: 'accounting-degree.pdf' } }],
      credentials: [{ type: 'certificate', name: 'اعتماد مهني', issuer: 'جهة مهنية', issueDate: '2021-01-01', expiryDate: '', document: { name: 'professional-certificate.pdf' } }],
    }),
  },
  {
    id: 'KYC-2042', status: KYC_STATUS.NEEDS_INFORMATION, submittedAt: 'أمس، 4:22 م',
    expert: { name: 'م. أحمد سالم', email: 'ahmad.s@example.com', phone: '+971 50 112 7781' },
    application: makeApplication({
      fullName: 'م. أحمد سالم', country: 'other', domain: 'technology', jurisdiction: 'الإمارات', identity: 'passport-ahmad.pdf', cv: 'ahmad-cv.pdf',
      experience: [{ jobTitle: 'خبير أمن معلومات', organization: 'شركة تقنية', from: '2017-01', to: '', current: true, description: 'أمن معلومات وحوكمة.' }],
      qualification: [{ degree: 'بكالوريوس', field: 'هندسة حاسوب', institution: 'جامعة', graduationYear: '2017', document: { name: 'engineering-degree.pdf' } }],
      samples: ['security-experience.pdf'],
    }),
    review: { decisionReason: 'يرجى إضافة إثبات اعتماد مهني ساري.' },
  },
  {
    id: 'KYC-2036', status: KYC_STATUS.VERIFIED, submittedAt: '12 سبتمبر',
    expert: { name: 'د. ليان ناصر', email: 'layan.n@example.com', phone: '+970 56 733 6612' },
    application: makeApplication({
      fullName: 'د. ليان ناصر', domain: 'business', jurisdiction: 'فلسطين', identity: 'identity-layan.pdf', cv: 'layan-cv.pdf',
      experience: [{ jobTitle: 'مستشارة إدارة وتشغيل', organization: 'شركة استشارات', from: '2014-01', to: '', current: true, description: 'إدارة وتشغيل.' }],
      qualification: [{ degree: 'دكتوراه', field: 'إدارة أعمال', institution: 'جامعة', graduationYear: '2014', document: { name: 'phd-degree.pdf' } }],
      samples: ['work-history.pdf'],
    }),
    review: { decisionReason: 'تمت مراجعة جميع المستندات المطلوبة واعتماد طلب التوثيق.' },
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function defaultState() {
  return {
    requests: Object.fromEntries(SEED_REQUESTS.map((request) => [request.id, { ...request, review: { checks: {}, ...(request.review || {}) } }])),
    expertIndex: Object.fromEntries(SEED_REQUESTS.map((request) => [request.expert.email.toLowerCase(), request.id])),
    sequence: 2100,
  };
}

function readState() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = defaultState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return parsed?.requests ? parsed : defaultState();
  } catch {
    return defaultState();
  }
}

function writeState(state) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const cleanEmail = (email) => String(email || '').trim().toLowerCase();

export function getKycRequests() {
  return Object.values(readState().requests).sort((a, b) => String(b.id).localeCompare(String(a.id)));
}

export function getKycRequest(id) {
  return readState().requests[id] || null;
}

export function getExpertKycRequest(email) {
  const state = readState();
  const id = state.expertIndex[cleanEmail(email)];
  return id ? state.requests[id] || null : null;
}

export function submitExpertKyc({ expert, application }) {
  const state = readState();
  const email = cleanEmail(expert?.email) || 'expert@solveit.local';
  let id = state.expertIndex[email];
  if (!id) {
    state.sequence = Number(state.sequence || 2100) + 1;
    id = `KYC-${state.sequence}`;
    state.expertIndex[email] = id;
  }

  const previous = state.requests[id] || {};
  state.requests[id] = {
    ...previous,
    id,
    expert: {
      name: expert?.name || application?.identityAndScope?.fullName || previous.expert?.name || 'خبير SolveIt',
      email,
      phone: expert?.phone || previous.expert?.phone || '—',
    },
    status: KYC_STATUS.SUBMITTED,
    submittedAt: nowLabel(),
    application: { ...clone(application), verificationStatus: KYC_STATUS.SUBMITTED },
    review: { checks: {}, decisionReason: '' },
  };
  writeState(state);
  return clone(state.requests[id]);
}

export function updateKycRequest(id, patch = {}) {
  const state = readState();
  const request = state.requests[id];
  if (!request) return null;
  state.requests[id] = {
    ...request,
    ...patch,
    review: patch.review ? { ...(request.review || {}), ...patch.review } : request.review,
  };
  writeState(state);
  return clone(state.requests[id]);
}

export function saveKycChecks(id, checks) {
  const request = getKycRequest(id);
  if (!request) return null;
  return updateKycRequest(id, { review: { ...(request.review || {}), checks } });
}

export function getKycChecks(id) {
  return getKycRequest(id)?.review?.checks || {};
}

export function getStatusMeta(status) {
  return KYC_STATUS_META[status] || KYC_STATUS_META.draft;
}

export function fileName(file) {
  return file?.name || file?.file || '';
}

export function collectKycDocuments(application = {}) {
  const docs = [];
  const add = (id, label, file) => {
    const name = fileName(file);
    if (name) docs.push({ id, label, file: name, meta: file });
  };

  add('identity', 'وثيقة الهوية الرسمية', application.identityAndScope?.identityEvidence);
  add('cv', 'السيرة الذاتية', application.cv);
  (application.qualifications || []).forEach((item, index) => add(`qualification-${index + 1}`, `وثيقة المؤهل ${index + 1}`, item.document));
  (application.credentials || []).forEach((item, index) => add(`credential-${index + 1}`, `${item.type === 'license' ? 'رخصة' : 'شهادة'}: ${item.name || index + 1}`, item.document));
  (application.workSamples || []).forEach((item, index) => add(`sample-${index + 1}`, `عينة عمل ${index + 1}`, item));
  return docs;
}

export function toAdminKycView(request) {
  if (!request) return null;
  const application = request.application || {};
  const identity = application.identityAndScope || {};
  const firstExperience = application.experiences?.[0];
  const firstQualification = application.qualifications?.[0];
  const meta = getStatusMeta(request.status);
  return {
    ...request,
    name: request.expert?.name || identity.fullName || '—',
    email: request.expert?.email || '—',
    phone: request.expert?.phone || '—',
    statusCode: request.status,
    status: meta.ar,
    tone: meta.tone,
    submitted: request.submittedAt || '—',
    domain: identity.domain || '—',
    jurisdiction: identity.jurisdiction || '—',
    country: identity.country || '—',
    language: identity.language || '—',
    experience: firstExperience ? `${firstExperience.jobTitle || 'خبرة مهنية'} — ${firstExperience.organization || ''}` : '—',
    degree: firstQualification ? `${firstQualification.degree || ''} ${firstQualification.field || ''}`.trim() || '—' : '—',
    documents: collectKycDocuments(application),
    decisionReason: request.review?.decisionReason || '',
  };
}
