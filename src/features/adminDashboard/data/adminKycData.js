import {
  KYC_STATUS,
  getKycChecks,
  getKycRequest,
  getKycRequests,
  getStatusMeta,
  saveKycChecks,
  toAdminKycView,
  updateKycRequest,
} from '../../kyc/data/kycStore';

const STATUS_FROM_AR = Object.freeze({
  'مسودة': KYC_STATUS.DRAFT,
  'مُقدّم': KYC_STATUS.SUBMITTED,
  'قيد المراجعة': KYC_STATUS.UNDER_REVIEW,
  'تحتاج معلومات': KYC_STATUS.NEEDS_INFORMATION,
  'مقبول': KYC_STATUS.VERIFIED,
  'مرفوض': KYC_STATUS.REJECTED,
});

export const toneForKycStatus = (status) => getStatusMeta(STATUS_FROM_AR[status] || status).tone;
export const getAdminKycRequests = () => getKycRequests().map(toAdminKycView);
export const getAdminKycRequest = (id) => toAdminKycView(getKycRequest(id));
export const getAdminKycChecks = (id) => getKycChecks(id);
export const saveAdminKycChecks = (id, checks) => saveKycChecks(id, checks);

export const updateAdminKycRequest = (id, patch) => {
  const statusCode = patch.statusCode || STATUS_FROM_AR[patch.status];
  const reviewPatch = patch.decisionReason !== undefined ? { decisionReason: patch.decisionReason } : undefined;
  return updateKycRequest(id, {
    ...(statusCode ? { status: statusCode } : {}),
    ...(reviewPatch ? { review: reviewPatch } : {}),
  });
};
