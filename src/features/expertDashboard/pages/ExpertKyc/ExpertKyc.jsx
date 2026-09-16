import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import ExpertFileUpload from '../../components/ExpertFileUpload/ExpertFileUpload';
import ExpertShell from '../../components/ExpertShell/ExpertShell';
import {
  createEmptyCredential,
  createEmptyExperience,
  createEmptyQualification,
  EXPERT_VERIFICATION_STATUS,
} from '../../data/expertDashboardData';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';
import useAuth from '../../../../hooks/useAuth';
import { getExpertKycRequest, submitExpertKyc } from '../../../kyc/data/kycStore';

const countryOptions = {
  ar: [['', 'اختر البلد'], ['jo', 'الأردن'], ['ps', 'فلسطين'], ['us', 'الولايات المتحدة'], ['other', 'بلد آخر']],
  en: [['', 'Choose country'], ['jo', 'Jordan'], ['ps', 'Palestine'], ['us', 'United States'], ['other', 'Other country']],
};

const languageOptions = [['', '—'], ['ar', 'العربية'], ['en', 'English'], ['ar-en', 'العربية وEnglish']];

const domainOptions = {
  ar: [['', 'اختر المجال'], ['legal', 'قانون واستشارات قانونية'], ['technology', 'تقنية وبرمجيات'], ['finance', 'مالية ومحاسبة'], ['business', 'أعمال وتشغيل'], ['engineering', 'هندسة وعقار'], ['career', 'مسار مهني وموارد بشرية'], ['other', 'مجال آخر']],
  en: [['', 'Choose domain'], ['legal', 'Legal'], ['technology', 'Technology & software'], ['finance', 'Finance & accounting'], ['business', 'Business & operations'], ['engineering', 'Engineering & real estate'], ['career', 'Career & HR'], ['other', 'Other']],
};

const emptyApplication = {
  fullName: '',
  country: '',
  language: '',
  domain: '',
  jurisdiction: '',
  identityEvidence: null,
  cv: null,
  experiences: [],
  qualifications: [],
  credentials: [],
  workSamples: [],
  payoutReadiness: 'not_ready',
};

const fileMeta = (file) => (file ? {
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
} : null);

const storedApplicationToForm = (payload) => {
  if (!payload) return emptyApplication;
  const identity = payload.identityAndScope || {};
  return {
    fullName: identity.fullName || '',
    country: identity.country || '',
    language: identity.language || '',
    domain: identity.domain || '',
    jurisdiction: identity.jurisdiction || '',
    identityEvidence: identity.identityEvidence || null,
    cv: payload.cv || null,
    experiences: (payload.experiences || []).map((entry, index) => ({ id: entry.id || `experience-stored-${index}`, ...entry })),
    qualifications: (payload.qualifications || []).map((entry, index) => ({ id: entry.id || `qualification-stored-${index}`, ...entry })),
    credentials: (payload.credentials || []).map((entry, index) => ({ id: entry.id || `credential-stored-${index}`, ...entry })),
    workSamples: payload.workSamples || [],
    payoutReadiness: payload.payoutReadiness || 'not_ready',
  };
};

export const prepareVerificationPayload = (application) => ({
  verificationStatus: EXPERT_VERIFICATION_STATUS,
  identityAndScope: {
    fullName: application.fullName.trim(),
    country: application.country,
    language: application.language,
    domain: application.domain,
    jurisdiction: application.jurisdiction.trim(),
    identityEvidence: fileMeta(application.identityEvidence),
  },
  cv: fileMeta(application.cv),
  experiences: application.experiences.map(({ id, ...entry }) => ({ ...entry })),
  qualifications: application.qualifications.map(({ id, document, ...entry }) => ({
    ...entry,
    document: fileMeta(document),
  })),
  credentials: application.credentials.map(({ id, document, ...entry }) => ({
    ...entry,
    document: fileMeta(document),
  })),
  workSamples: application.workSamples.map(fileMeta),
  payoutReadiness: application.payoutReadiness,
});

function FormField({ label, id, error = '', hint = '', className = '', children }) {
  return (
    <label className={`expert-field${error ? ' is-error' : ''}${className ? ` ${className}` : ''}`} htmlFor={id}>
      <span>{label}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="expert-field-error" id={`${id}-error`}>{error}</small>}
    </label>
  );
}

function SectionHeader({ icon, number, title, body, id }) {
  return (
    <header className="expert-form-section__header">
      <div>
        <span className="expert-section-kicker"><AdminIcon name={icon} size={16} />{number}</span>
        <h2 id={id}>{title}</h2>
        <p>{body}</p>
      </div>
    </header>
  );
}

function EntryHeader({ title, onRemove, removeLabel }) {
  return (
    <div className="expert-entry-card__header">
      <b>{title}</b>
      <button className="expert-text-button is-danger" type="button" onClick={onRemove}>
        <AdminIcon name="close" size={15} />{removeLabel}
      </button>
    </div>
  );
}

function ExpertKycContent({ request, setRequest, expertAccount, expertEmail }) {
  const { language, t } = useExpertI18n();
  const [application, setApplication] = useState(() => storedApplicationToForm(request?.application));
  const [submitted, setSubmitted] = useState(false);
  const [payloadPrepared, setPayloadPrepared] = useState(false);
  const firstErrorRef = useRef(null);

  useEffect(() => {
    if (request?.application) setApplication(storedApplicationToForm(request.application));
  }, [request?.id]);

  const verificationStatus = request?.status || EXPERT_VERIFICATION_STATUS;

  const sectionLinks = [
    ['identity', 'kyc.sections.identity'],
    ['experience', 'kyc.sections.experience'],
    ['education', 'kyc.sections.education'],
    ['credentials', 'kyc.sections.credentials'],
    ['samples', 'kyc.sections.samples'],
    ['payout', 'kyc.sections.payout'],
  ];

  const errors = useMemo(() => {
    const next = {};
    ['fullName', 'country', 'language', 'domain', 'jurisdiction'].forEach((field) => {
      if (!String(application[field] || '').trim()) next[field] = t('kyc.required');
    });
    if (!application.identityEvidence) next.identityEvidence = t('kyc.required');

    const hasCompleteExperience = application.experiences.some((entry) => entry.jobTitle.trim() && entry.organization.trim());
    if (!application.cv && !hasCompleteExperience) next.cvOrExperience = t('kyc.cvOrExperienceRequired');

    application.experiences.forEach((entry) => {
      const started = Object.entries(entry).some(([key, value]) => !['id', 'current'].includes(key) && String(value || '').trim());
      if (started && (!entry.jobTitle.trim() || !entry.organization.trim())) next[`experience-${entry.id}`] = t('kyc.incompleteEntry');
    });

    application.qualifications.forEach((entry) => {
      const started = [entry.degree, entry.field, entry.institution, entry.graduationYear, entry.document].some(Boolean);
      if (started && (!entry.degree.trim() || !entry.institution.trim())) next[`qualification-${entry.id}`] = t('kyc.incompleteEntry');
    });

    application.credentials.forEach((entry) => {
      const started = [entry.name, entry.issuer, entry.issueDate, entry.expiryDate, entry.document].some(Boolean);
      if (started && (!entry.name.trim() || !entry.issuer.trim())) next[`credential-${entry.id}`] = t('kyc.incompleteEntry');
    });
    return next;
  }, [application, t]);

  const completion = useMemo(() => {
    const checkpoints = [
      Boolean(application.fullName.trim()),
      Boolean(application.country),
      Boolean(application.language),
      Boolean(application.domain),
      Boolean(application.jurisdiction.trim()),
      Boolean(application.identityEvidence),
      Boolean(application.cv || application.experiences.some((entry) => entry.jobTitle.trim() && entry.organization.trim())),
    ];
    return Math.round((checkpoints.filter(Boolean).length / checkpoints.length) * 100);
  }, [application]);

  const update = (field, value) => {
    setApplication((current) => ({ ...current, [field]: value }));
    setPayloadPrepared(false);
  };

  const updateCollection = (collection, id, field, value) => {
    setApplication((current) => ({
      ...current,
      [collection]: current[collection].map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    }));
    setPayloadPrepared(false);
  };

  const addEntry = (collection, factory) => {
    setApplication((current) => ({ ...current, [collection]: [...current[collection], factory()] }));
    setPayloadPrepared(false);
  };

  const removeEntry = (collection, id) => {
    setApplication((current) => ({ ...current, [collection]: current[collection].filter((entry) => entry.id !== id) }));
    setPayloadPrepared(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setPayloadPrepared(false);
    if (Object.keys(errors).length) {
      window.requestAnimationFrame(() => firstErrorRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const payload = prepareVerificationPayload(application);
    const savedRequest = submitExpertKyc({
      expert: {
        name: expertAccount?.name || expertAccount?.full_name || application.fullName,
        email: expertEmail,
        phone: expertAccount?.phone || expertAccount?.mobile || '',
      },
      application: payload,
    });
    setRequest(savedRequest);
    setPayloadPrepared(true);
  };

  const fieldError = (key) => (submitted ? errors[key] : '');

  return (
    <>
      <header className="admin-page-heading expert-page-heading">
        <div>
          <nav aria-label={t('kyc.breadcrumb')}><span>{t('dashboard.workspace')}</span><AdminIcon name="chevron" size={14} /><strong>{t('kyc.breadcrumb')}</strong></nav>
          <h1>{t('kyc.title')}</h1>
          <p>{t('kyc.subtitle')}</p>
        </div>
        <span className={`expert-status-chip is-${verificationStatus.replaceAll('_', '-')}`}><i />{t(`status.${verificationStatus}`)}</span>
      </header>

      <section className="expert-kyc-summary" aria-label={t('kyc.statusLabel')}>
        <div className="expert-private-note">
          <span><AdminIcon name="shield" size={20} /></span>
          <div><b>{t('kyc.privateTitle')}</b><p>{t('kyc.privateBody')}</p></div>
        </div>
        <div className="expert-kyc-progress">
          <div className="expert-progress-heading"><span>{t('kyc.progressLabel')}</span><b>{completion}%</b></div>
          <div className="expert-progress-track" aria-hidden="true"><span style={{ width: `${completion}%` }} /></div>
        </div>
      </section>

      <nav className="expert-section-nav" aria-label={t('kyc.title')}>
        {sectionLinks.map(([id, key], index) => <a key={id} href={`#kyc-${id}`}><span>{String(index + 1).padStart(2, '0')}</span>{t(key)}</a>)}
      </nav>

      <form className="expert-kyc-form" onSubmit={onSubmit} noValidate ref={firstErrorRef}>
        <section className="expert-form-section" id="kyc-identity" aria-labelledby="kyc-identity-title">
          <SectionHeader icon="userCheck" number="01" id="kyc-identity-title" title={t('kyc.identityTitle')} body={t('kyc.identityBody')} />
          <div className="expert-form-grid">
            <FormField label={t('profile.fullName')} id="kyc-full-name" error={fieldError('fullName')}>
              <input id="kyc-full-name" value={application.fullName} onChange={(event) => update('fullName', event.target.value)} aria-invalid={Boolean(fieldError('fullName'))} aria-describedby={fieldError('fullName') ? 'kyc-full-name-error' : undefined} autoComplete="name" />
            </FormField>
            <FormField label={t('profile.country')} id="kyc-country" error={fieldError('country')}>
              <select id="kyc-country" value={application.country} onChange={(event) => update('country', event.target.value)} aria-invalid={Boolean(fieldError('country'))}>{countryOptions[language].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </FormField>
            <FormField label={t('profile.domain')} id="kyc-domain" error={fieldError('domain')}>
              <select id="kyc-domain" value={application.domain} onChange={(event) => update('domain', event.target.value)} aria-invalid={Boolean(fieldError('domain'))}>{domainOptions[language].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </FormField>
            <FormField label={t('kyc.jurisdiction')} id="kyc-jurisdiction" error={fieldError('jurisdiction')}>
              <input id="kyc-jurisdiction" value={application.jurisdiction} onChange={(event) => update('jurisdiction', event.target.value)} aria-invalid={Boolean(fieldError('jurisdiction'))} />
            </FormField>
            <FormField label={t('profile.language')} id="kyc-language" error={fieldError('language')}>
              <select id="kyc-language" value={application.language} onChange={(event) => update('language', event.target.value)} aria-invalid={Boolean(fieldError('language'))}>{languageOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </FormField>
          </div>
          <ExpertFileUpload label={t('kyc.identityEvidence')} value={application.identityEvidence} onChange={(file) => update('identityEvidence', file)} error={fieldError('identityEvidence')} />
        </section>

        <section className="expert-form-section" id="kyc-experience" aria-labelledby="kyc-experience-title">
          <SectionHeader icon="briefcase" number="02" id="kyc-experience-title" title={t('kyc.experienceTitle')} body={t('kyc.experienceBody')} />
          <ExpertFileUpload label={t('kyc.cv')} value={application.cv} onChange={(file) => update('cv', file)} error={fieldError('cvOrExperience')} />
          <div className="expert-entry-list">
            {application.experiences.map((entry, index) => (
              <article className={`expert-entry-card${fieldError(`experience-${entry.id}`) ? ' is-error' : ''}`} key={entry.id}>
                <EntryHeader title={`${t('kyc.sections.experience')} ${index + 1}`} onRemove={() => removeEntry('experiences', entry.id)} removeLabel={t('kyc.removeEntry')} />
                <div className="expert-form-grid">
                  <FormField label={t('kyc.jobTitle')} id={`experience-title-${entry.id}`}><input id={`experience-title-${entry.id}`} value={entry.jobTitle} onChange={(event) => updateCollection('experiences', entry.id, 'jobTitle', event.target.value)} /></FormField>
                  <FormField label={t('kyc.organization')} id={`experience-org-${entry.id}`}><input id={`experience-org-${entry.id}`} value={entry.organization} onChange={(event) => updateCollection('experiences', entry.id, 'organization', event.target.value)} /></FormField>
                  <FormField label={t('kyc.from')} id={`experience-from-${entry.id}`}><input id={`experience-from-${entry.id}`} type="month" value={entry.from} onChange={(event) => updateCollection('experiences', entry.id, 'from', event.target.value)} /></FormField>
                  <FormField label={t('kyc.to')} id={`experience-to-${entry.id}`}><input id={`experience-to-${entry.id}`} type="month" value={entry.to} onChange={(event) => updateCollection('experiences', entry.id, 'to', event.target.value)} disabled={entry.current} /></FormField>
                  <label className="expert-checkbox-field"><input type="checkbox" checked={entry.current} onChange={(event) => { updateCollection('experiences', entry.id, 'current', event.target.checked); if (event.target.checked) updateCollection('experiences', entry.id, 'to', ''); }} /><span>{t('kyc.current')}</span></label>
                  <FormField className="is-full" label={t('kyc.description')} id={`experience-description-${entry.id}`}><textarea id={`experience-description-${entry.id}`} rows="3" value={entry.description} onChange={(event) => updateCollection('experiences', entry.id, 'description', event.target.value)} /></FormField>
                </div>
                {fieldError(`experience-${entry.id}`) && <small className="expert-entry-error" role="alert">{fieldError(`experience-${entry.id}`)}</small>}
              </article>
            ))}
          </div>
          <button className="expert-secondary-button expert-add-button" type="button" onClick={() => addEntry('experiences', createEmptyExperience)}><AdminIcon name="plus" size={16} />{t('kyc.addExperience')}</button>
        </section>

        <section className="expert-form-section" id="kyc-education" aria-labelledby="kyc-education-title">
          <SectionHeader icon="verified" number="03" id="kyc-education-title" title={t('kyc.educationTitle')} body={t('kyc.educationBody')} />
          <div className="expert-entry-list">
            {application.qualifications.map((entry, index) => (
              <article className={`expert-entry-card${fieldError(`qualification-${entry.id}`) ? ' is-error' : ''}`} key={entry.id}>
                <EntryHeader title={`${t('kyc.sections.education')} ${index + 1}`} onRemove={() => removeEntry('qualifications', entry.id)} removeLabel={t('kyc.removeEntry')} />
                <div className="expert-form-grid">
                  <FormField label={t('kyc.degree')} id={`qualification-degree-${entry.id}`}><input id={`qualification-degree-${entry.id}`} value={entry.degree} onChange={(event) => updateCollection('qualifications', entry.id, 'degree', event.target.value)} /></FormField>
                  <FormField label={t('kyc.field')} id={`qualification-field-${entry.id}`}><input id={`qualification-field-${entry.id}`} value={entry.field} onChange={(event) => updateCollection('qualifications', entry.id, 'field', event.target.value)} /></FormField>
                  <FormField label={t('kyc.institution')} id={`qualification-institution-${entry.id}`}><input id={`qualification-institution-${entry.id}`} value={entry.institution} onChange={(event) => updateCollection('qualifications', entry.id, 'institution', event.target.value)} /></FormField>
                  <FormField label={t('kyc.graduationYear')} id={`qualification-year-${entry.id}`}><input id={`qualification-year-${entry.id}`} inputMode="numeric" value={entry.graduationYear} onChange={(event) => updateCollection('qualifications', entry.id, 'graduationYear', event.target.value)} /></FormField>
                </div>
                <ExpertFileUpload label={t('kyc.degreeDocument')} value={entry.document} onChange={(file) => updateCollection('qualifications', entry.id, 'document', file)} />
                {fieldError(`qualification-${entry.id}`) && <small className="expert-entry-error" role="alert">{fieldError(`qualification-${entry.id}`)}</small>}
              </article>
            ))}
          </div>
          <button className="expert-secondary-button expert-add-button" type="button" onClick={() => addEntry('qualifications', createEmptyQualification)}><AdminIcon name="plus" size={16} />{t('kyc.addQualification')}</button>
        </section>

        <section className="expert-form-section" id="kyc-credentials" aria-labelledby="kyc-credentials-title">
          <SectionHeader icon="shield" number="04" id="kyc-credentials-title" title={t('kyc.credentialsTitle')} body={t('kyc.credentialsBody')} />
          <div className="expert-entry-list">
            {application.credentials.map((entry, index) => (
              <article className={`expert-entry-card${fieldError(`credential-${entry.id}`) ? ' is-error' : ''}`} key={entry.id}>
                <EntryHeader title={`${t('kyc.sections.credentials')} ${index + 1}`} onRemove={() => removeEntry('credentials', entry.id)} removeLabel={t('kyc.removeEntry')} />
                <div className="expert-form-grid">
                  <FormField label={t('kyc.credentialType')} id={`credential-type-${entry.id}`}><select id={`credential-type-${entry.id}`} value={entry.type} onChange={(event) => updateCollection('credentials', entry.id, 'type', event.target.value)}><option value="certificate">{t('kyc.certificate')}</option><option value="license">{t('kyc.license')}</option></select></FormField>
                  <FormField label={t('kyc.credentialName')} id={`credential-name-${entry.id}`}><input id={`credential-name-${entry.id}`} value={entry.name} onChange={(event) => updateCollection('credentials', entry.id, 'name', event.target.value)} /></FormField>
                  <FormField label={t('kyc.issuer')} id={`credential-issuer-${entry.id}`}><input id={`credential-issuer-${entry.id}`} value={entry.issuer} onChange={(event) => updateCollection('credentials', entry.id, 'issuer', event.target.value)} /></FormField>
                  <FormField label={t('kyc.issueDate')} id={`credential-issue-${entry.id}`}><input id={`credential-issue-${entry.id}`} type="date" value={entry.issueDate} onChange={(event) => updateCollection('credentials', entry.id, 'issueDate', event.target.value)} /></FormField>
                  <FormField label={t('kyc.expiryDate')} id={`credential-expiry-${entry.id}`}><input id={`credential-expiry-${entry.id}`} type="date" value={entry.expiryDate} onChange={(event) => updateCollection('credentials', entry.id, 'expiryDate', event.target.value)} /></FormField>
                </div>
                <ExpertFileUpload label={t('kyc.credentialDocument')} value={entry.document} onChange={(file) => updateCollection('credentials', entry.id, 'document', file)} />
                {fieldError(`credential-${entry.id}`) && <small className="expert-entry-error" role="alert">{fieldError(`credential-${entry.id}`)}</small>}
              </article>
            ))}
          </div>
          <button className="expert-secondary-button expert-add-button" type="button" onClick={() => addEntry('credentials', createEmptyCredential)}><AdminIcon name="plus" size={16} />{t('kyc.addCredential')}</button>
        </section>

        <section className="expert-form-section" id="kyc-samples" aria-labelledby="kyc-samples-title">
          <SectionHeader icon="paperclip" number="05" id="kyc-samples-title" title={t('kyc.samplesTitle')} body={t('kyc.samplesBody')} />
          <div className="expert-inline-note is-warning"><AdminIcon name="info" size={18} /><span>{t('kyc.samplesPrivacy')}</span></div>
          <ExpertFileUpload label={t('kyc.workSamples')} multiple value={application.workSamples} onChange={(files) => update('workSamples', files)} />
        </section>

        <section className="expert-form-section" id="kyc-payout" aria-labelledby="kyc-payout-title">
          <SectionHeader icon="activity" number="06" id="kyc-payout-title" title={t('kyc.payoutTitle')} body={t('kyc.payoutBody')} />
          <div className="expert-payout-status">
            <span><AdminIcon name="clock" size={19} /></span>
            <div><small>{t('kyc.payoutStatus')}</small><b>{t('kyc.payoutPending')}</b><p>{t('kyc.payoutHelper')}</p></div>
          </div>
        </section>

        <section className="expert-submit-panel" aria-labelledby="kyc-submit-title">
          <div><span className="expert-section-kicker"><AdminIcon name="verified" size={16} />{t('kyc.statusLabel')}: {t(`status.${verificationStatus}`)}</span><h2 id="kyc-submit-title">{t('kyc.submitTitle')}</h2><p>{t('kyc.submitBody')}</p></div>
          <button className="expert-primary-button is-prominent" type="submit"><AdminIcon name="check" size={18} />{t('kyc.submit')}</button>
        </section>
        {payloadPrepared && <div className="expert-submit-success" role="status"><AdminIcon name="check" size={18} /><span>{t('kyc.submitPrepared')}</span></div>}
      </form>
    </>
  );
}

export default function ExpertKyc() {
  const { sessions } = useAuth();
  const expertAccount = sessions.expert?.account || {};
  const expertEmail = expertAccount.email || 'expert@solveit.local';
  const [request, setRequest] = useState(() => getExpertKycRequest(expertEmail));

  useEffect(() => {
    setRequest(getExpertKycRequest(expertEmail));
  }, [expertEmail]);

  const verificationStatus = request?.status || sessions.expert?.kycStatus || EXPERT_VERIFICATION_STATUS;

  return (
    <ExpertShell activePage="kyc" verificationStatus={verificationStatus}>
      <ExpertKycContent
        request={request}
        setRequest={setRequest}
        expertAccount={expertAccount}
        expertEmail={expertEmail}
      />
    </ExpertShell>
  );
}
