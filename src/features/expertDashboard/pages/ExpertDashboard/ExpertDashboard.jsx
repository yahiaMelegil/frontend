import React from 'react';
import { Link } from 'react-router-dom';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import ExpertShell from '../../components/ExpertShell/ExpertShell';
import {
  EXPERT_VERIFICATION_STATUS,
  lockedWorkspacePreview,
  onboardingSteps,
} from '../../data/expertDashboardData';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';
import { PATHS } from '../../../../routes/paths';
import useAuth from '../../../../hooks/useAuth';
import { getExpertKycRequest } from '../../../kyc/data/kycStore';

function ExpertDashboardContent({ verificationStatus }) {
  const { t } = useExpertI18n();
  const completedSteps = onboardingSteps.filter((step) => step.state === 'complete').length;
  const progress = Math.round((completedSteps / onboardingSteps.length) * 100);

  return (
    <>
      <header className="admin-page-heading expert-page-heading">
        <div>
          <nav aria-label={t('dashboard.breadcrumb')}>
            <span>{t('dashboard.workspace')}</span><AdminIcon name="chevron" size={14} /><strong>{t('dashboard.overview')}</strong>
          </nav>
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>
        <span className={`expert-status-chip is-${verificationStatus.replaceAll('_', '-')}`}><i />{t(`status.${verificationStatus}`)}</span>
      </header>

      <section className="expert-onboarding-card" aria-labelledby="expert-onboarding-title">
        <div className="expert-onboarding-card__intro">
          <span className="expert-section-kicker"><AdminIcon name="verified" size={16} />{t('dashboard.statusEyebrow')}</span>
          <h2 id="expert-onboarding-title">{t('dashboard.statusTitle')}</h2>
          <p>{t('dashboard.statusBody')}</p>
        </div>
        <div className="expert-onboarding-card__progress" aria-label={`${t('dashboard.progressLabel')}: ${progress}%`}>
          <div className="expert-progress-heading"><span>{t('dashboard.progressLabel')}</span><b>{completedSteps}/{onboardingSteps.length}</b></div>
          <div className="expert-progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <div className="expert-onboarding-steps">
            {onboardingSteps.map((step, index) => (
              <div className={`expert-onboarding-step is-${step.state}`} key={step.id}>
                <span>{step.state === 'complete' ? <AdminIcon name="check" size={15} /> : index + 1}</span>
                <b>{t(step.labelKey)}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="expert-next-actions" aria-label={t('dashboard.statusTitle')}>
        <article className="expert-action-card is-profile">
          <div className="expert-action-card__icon"><AdminIcon name="person" size={23} /></div>
          <div className="expert-action-card__body">
            <span className="expert-action-card__status"><i />{t('dashboard.profileCardStatus')}</span>
            <h2>{t('dashboard.profileCardTitle')}</h2>
            <p>{t('dashboard.profileCardBody')}</p>
          </div>
          <Link className="expert-primary-button" to={PATHS.EXPERT_PROFILE}>{t('dashboard.profileCardButton')}<AdminIcon name="arrow" size={17} /></Link>
        </article>

        <article className="expert-action-card is-kyc">
          <div className="expert-action-card__icon"><AdminIcon name="verified" size={23} /></div>
          <div className="expert-action-card__body">
            <span className="expert-action-card__status"><i />{t('dashboard.kycCardStatus')}</span>
            <h2>{t('dashboard.kycCardTitle')}</h2>
            <p>{t('dashboard.kycCardBody')}</p>
          </div>
          <Link className="expert-secondary-button" to={PATHS.EXPERT_KYC}>{t('dashboard.kycCardButton')}<AdminIcon name="arrow" size={17} /></Link>
        </article>
      </section>

      <section className="expert-unlock-panel" aria-labelledby="expert-unlock-title">
        <div className="expert-unlock-panel__header">
          <div><span className="expert-section-kicker"><AdminIcon name="lock" size={16} />{t('dashboard.availableAfterApproval')}</span><h2 id="expert-unlock-title">{t('dashboard.unlockTitle')}</h2><p>{t('dashboard.unlockBody')}</p></div>
        </div>
        <div className="expert-locked-grid">
          {lockedWorkspacePreview.map((item) => (
            <div className="expert-locked-item" key={item.id} aria-disabled="true">
              <span><AdminIcon name={item.icon} size={19} /></span>
              <b>{t(item.labelKey)}</b>
              <small><AdminIcon name="lock" size={13} />{t('dashboard.availableAfterApproval')}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function ExpertDashboard() {
  const { sessions } = useAuth();
  const expertEmail = sessions.expert?.account?.email || 'expert@solveit.local';
  const request = getExpertKycRequest(expertEmail);
  const verificationStatus = request?.status || sessions.expert?.kycStatus || EXPERT_VERIFICATION_STATUS;

  return (
    <ExpertShell activePage="overview" verificationStatus={verificationStatus}>
      <ExpertDashboardContent verificationStatus={verificationStatus} />
    </ExpertShell>
  );
}
