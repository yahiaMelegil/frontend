import { PATHS } from '../../../routes/paths';

export const EXPERT_VERIFICATION_STATUS = 'draft';

export const EXPERT_VERIFICATION_STATUSES = Object.freeze([
  'draft',
  'submitted',
  'under_review',
  'needs_information',
  'verified',
  'partially_verified',
  'rejected',
]);

export const isExpertVerified = (status) => status === 'verified';

export const expertSidebarGroups = Object.freeze([
  {
    labelKey: 'sidebar.groups.overview',
    items: [
      { id: 'overview', labelKey: 'sidebar.items.overview', icon: 'dashboard', path: PATHS.EXPERT_DASHBOARD },
    ],
  },
  {
    labelKey: 'sidebar.groups.account',
    items: [
      { id: 'profile', labelKey: 'sidebar.items.profile', icon: 'person', path: PATHS.EXPERT_PROFILE },
      { id: 'kyc', labelKey: 'sidebar.items.kyc', icon: 'verified', path: PATHS.EXPERT_KYC },
    ],
  },
  {
    labelKey: 'sidebar.groups.workspace',
    items: [
      { id: 'requests', labelKey: 'sidebar.items.requests', icon: 'mail', requiresVerification: true },
      { id: 'cases', labelKey: 'sidebar.items.cases', icon: 'case', requiresVerification: true },
      { id: 'consultations', labelKey: 'sidebar.items.consultations', icon: 'calendar', requiresVerification: true },
      { id: 'services', labelKey: 'sidebar.items.services', icon: 'briefcase', requiresVerification: true },
      { id: 'earnings', labelKey: 'sidebar.items.earnings', icon: 'activity', requiresVerification: true },
    ],
  },
]);

export const onboardingSteps = Object.freeze([
  { id: 'account', labelKey: 'dashboard.steps.account', state: 'complete' },
  { id: 'email', labelKey: 'dashboard.steps.email', state: 'complete' },
  { id: 'profile', labelKey: 'dashboard.steps.profile', state: 'current' },
  { id: 'kyc', labelKey: 'dashboard.steps.kyc', state: 'upcoming' },
  { id: 'review', labelKey: 'dashboard.steps.review', state: 'upcoming' },
  { id: 'approval', labelKey: 'dashboard.steps.approval', state: 'upcoming' },
]);

export const lockedWorkspacePreview = Object.freeze([
  { id: 'requests', labelKey: 'sidebar.items.requests', icon: 'mail' },
  { id: 'cases', labelKey: 'sidebar.items.cases', icon: 'case' },
  { id: 'consultations', labelKey: 'sidebar.items.consultations', icon: 'calendar' },
  { id: 'services', labelKey: 'sidebar.items.services', icon: 'briefcase' },
  { id: 'earnings', labelKey: 'sidebar.items.earnings', icon: 'activity' },
]);

export const profileRegistrationFields = Object.freeze([
  'fullName',
  'email',
  'country',
  'language',
  'domain',
]);

export const emptyExpertProfile = Object.freeze({
  photo: null,
  fullName: '',
  email: '',
  country: '',
  language: '',
  timezone: '',
  professionalTitle: '',
  domain: '',
  specialties: '',
  bio: '',
});

export const createEmptyExperience = () => ({
  id: `experience-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  jobTitle: '',
  organization: '',
  from: '',
  to: '',
  current: false,
  description: '',
});

export const createEmptyQualification = () => ({
  id: `qualification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  degree: '',
  field: '',
  institution: '',
  graduationYear: '',
  document: null,
});

export const createEmptyCredential = () => ({
  id: `credential-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type: 'certificate',
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  document: null,
});
