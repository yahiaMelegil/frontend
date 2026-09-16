import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../../components/AdminIcon/AdminIcon';
import AdminStatusPill from '../../components/AdminStatusPill/AdminStatusPill';
import { getAdminKycChecks, getAdminKycRequest, saveAdminKycChecks, updateAdminKycRequest } from '../../data/adminKycData';
import { PATHS } from '../../../../routes/paths';
import '../../AdminAccess.css';

const valueOrDash = (value) => value || '—';

function InfoGrid({ children }) {
  return <dl className="admin-kyc-facts admin-kyc-facts--page">{children}</dl>;
}

function Info({ label, value }) {
  return <div><dt>{label}</dt><dd>{valueOrDash(value)}</dd></div>;
}

export default function AdminKycReviewPage() {
  const { kycId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(() => getAdminKycRequest(kycId));
  const [checks, setChecks] = useState(() => getAdminKycChecks(kycId));
  const [rejecting, setRejecting] = useState(false);
  const [requestingInfo, setRequestingInfo] = useState(false);
  const [decisionReason, setDecisionReason] = useState('');

  useEffect(() => {
    if (!request || request.statusCode !== 'submitted') return;
    updateAdminKycRequest(request.id, { statusCode: 'under_review' });
    setRequest(getAdminKycRequest(request.id));
  }, []);

  const application = request?.application || {};
  const identity = application.identityAndScope || {};
  const experiences = application.experiences || [];
  const qualifications = application.qualifications || [];
  const credentials = application.credentials || [];
  const samples = application.workSamples || [];

  const checkedCount = useMemo(() => request ? request.documents.filter((document) => checks[document.id]).length : 0, [checks, request]);
  const allChecked = request ? checkedCount === request.documents.length : false;
  const isDecided = request ? ['verified', 'rejected'].includes(request.statusCode) : false;

  const toggleCheck = (documentId) => {
    const next = { ...checks, [documentId]: !checks[documentId] };
    setChecks(next);
    saveAdminKycChecks(kycId, next);
  };

  const decide = (statusCode, notify) => {
    if (!request) return;
    const defaultApproved = 'تمت مراجعة جميع بيانات ومستندات طلب KYC واعتماد الخبير.';
    const reason = statusCode === 'verified' ? defaultApproved : decisionReason.trim();
    updateAdminKycRequest(request.id, { statusCode, decisionReason: reason });
    setRequest(getAdminKycRequest(request.id));
    setRejecting(false);
    setRequestingInfo(false);
    setDecisionReason('');
    notify(statusCode === 'verified' ? 'تم قبول طلب KYC' : statusCode === 'rejected' ? 'تم رفض طلب KYC' : 'تم طلب معلومات إضافية من الخبير');
  };

  const downloadDocument = (document, notify) => {
    notify(`${document.file} — بيانات الملف موحّدة مع طلب الخبير، والتنزيل الفعلي يحتاج Endpoint ملفات من الـBackend`);
  };

  if (!request) {
    return <AdminPageFrame activePage="kyc" eyebrow="Expert Verification" title="طلب غير موجود" description="تعذر العثور على طلب KYC المطلوب." icon="verified">{() => <div className="admin-empty-state admin-kyc-review-empty"><AdminIcon name="search" size={30}/><b>طلب KYC غير موجود</b><Link className="admin-page-button is-primary" to={PATHS.ADMIN_KYC}>العودة إلى الطلبات</Link></div>}</AdminPageFrame>;
  }

  return (
    <AdminPageFrame
      activePage="kyc"
      eyebrow={`KYC Review · ${request.id}`}
      title="مراجعة طلب التوثيق"
      description="المراجعة هنا مبنية مباشرة على نفس أقسام نموذج KYC الموجود في لوحة الخبير."
      icon="verified"
      actions={[{ label: 'العودة للطلبات', icon: 'arrow', onClick: () => navigate(PATHS.ADMIN_KYC) }]}
    >
      {({ notify }) => <div className="admin-kyc-review-page">
        <section className="admin-kyc-review-card admin-kyc-review-profile">
          <div className="admin-kyc-review-profile__main"><div className="admin-kyc-avatar"><AdminIcon name="person" size={25}/></div><div><small>{request.id}</small><h2>{request.name}</h2><p>{request.email} · {request.phone}</p></div></div>
          <AdminStatusPill tone={request.tone}>{request.status}</AdminStatusPill>
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>01 · Identity & scope</span><h2>الهوية ونطاق الممارسة</h2><p>هذه الحقول هي نفسها التي يملؤها الخبير في أول قسم من KYC.</p></div></div>
          <InfoGrid>
            <Info label="الاسم الكامل" value={identity.fullName} /><Info label="البلد" value={identity.country} /><Info label="اللغة" value={identity.language} />
            <Info label="المجال" value={identity.domain} /><Info label="الاختصاص / Jurisdiction" value={identity.jurisdiction} /><Info label="حالة المستحقات" value={application.payoutReadiness} />
          </InfoGrid>
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>02 · CV & experience</span><h2>السيرة الذاتية والخبرة</h2><p>السجل المهني المرسل من الخبير دون إعادة صياغة نموذج خاص بالأدمن.</p></div></div>
          {experiences.length ? <div className="admin-kyc-unified-list">{experiences.map((item, index) => <article className="admin-kyc-unified-entry" key={`${item.jobTitle}-${index}`}><b>{item.jobTitle || `خبرة ${index + 1}`}</b><span>{item.organization || '—'}</span><small>{[item.from, item.current ? 'حتى الآن' : item.to].filter(Boolean).join(' — ')}</small>{item.description && <p>{item.description}</p>}</article>)}</div> : <p className="admin-kyc-muted">لا توجد خبرات مدخلة؛ قد يكون الخبير اعتمد على ملف CV فقط.</p>}
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>03 · Education</span><h2>المؤهلات الأكاديمية</h2><p>كل المؤهلات والوثائق المرتبطة بها كما أدخلها الخبير.</p></div></div>
          {qualifications.length ? <div className="admin-kyc-unified-list">{qualifications.map((item, index) => <article className="admin-kyc-unified-entry" key={`${item.degree}-${index}`}><b>{[item.degree, item.field].filter(Boolean).join(' — ') || `مؤهل ${index + 1}`}</b><span>{item.institution || '—'}</span><small>{item.graduationYear || '—'}</small></article>)}</div> : <p className="admin-kyc-muted">لا توجد مؤهلات مضافة.</p>}
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>04 · Credentials</span><h2>الشهادات والتراخيص</h2><p>الاعتمادات المهنية والتراخيص المرسلة ضمن نفس طلب الخبير.</p></div></div>
          {credentials.length ? <div className="admin-kyc-unified-list">{credentials.map((item, index) => <article className="admin-kyc-unified-entry" key={`${item.name}-${index}`}><b>{item.name || `اعتماد ${index + 1}`}</b><span>{item.issuer || '—'}</span><small>{item.type === 'license' ? 'رخصة' : 'شهادة'} · {item.issueDate || '—'}{item.expiryDate ? ` → ${item.expiryDate}` : ''}</small></article>)}</div> : <p className="admin-kyc-muted">لا توجد شهادات أو تراخيص مضافة.</p>}
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>05 · Work samples</span><h2>عينات العمل</h2><p>عينات خاصة بالمراجعة ولا يجب عرضها في الملف العام تلقائيًا.</p></div></div>
          {samples.length ? <div className="admin-kyc-unified-list">{samples.map((item, index) => <article className="admin-kyc-unified-entry" key={`${item?.name}-${index}`}><b>عينة عمل {index + 1}</b><span>{item?.name || 'ملف'}</span></article>)}</div> : <p className="admin-kyc-muted">لا توجد عينات عمل مرفقة.</p>}
        </section>

        <section className="admin-kyc-review-card">
          <div className="admin-access-section-head is-detail"><div><span>Documents checklist</span><h2>فحص جميع المستندات المرسلة</h2><p>القائمة تُشتق تلقائيًا من ملفات الهوية وCV والمؤهلات والشهادات وعينات العمل في طلب الخبير.</p></div><strong className="admin-role-create-count">{checkedCount}/{request.documents.length} تم فحصها</strong></div>
          <div className="admin-kyc-documents admin-kyc-documents--page">
            {request.documents.map((document) => <div className={`admin-kyc-document${checks[document.id] ? ' is-checked' : ''}`} key={document.id}>
              <input type="checkbox" aria-label={`تم فحص ${document.label}`} checked={Boolean(checks[document.id])} onChange={() => toggleCheck(document.id)} disabled={isDecided} />
              <span className="admin-kyc-document__icon"><AdminIcon name="policy" size={18}/></span>
              <span className="admin-kyc-document__copy"><b>{document.label}</b><small>{document.file}</small></span>
              <button type="button" onClick={() => downloadDocument(document, notify)}><AdminIcon name="download" size={16}/>Download</button>
            </div>)}
            {!request.documents.length && <p className="admin-kyc-muted">لا توجد ملفات قابلة للفحص في الطلب.</p>}
          </div>
        </section>

        <section className="admin-kyc-review-card admin-kyc-decision-card">
          <div className="admin-access-section-head is-detail"><div><span>Verification decision</span><h2>قرار التوثيق</h2><p>{allChecked ? 'اكتملت مراجعة جميع المستندات ويمكن اعتماد الطلب.' : `متبقي ${Math.max(0, request.documents.length - checkedCount)} مستندات قبل تفعيل القبول.`}</p></div></div>
          {request.decisionReason && <div className={`admin-kyc-decision-summary${request.statusCode === 'rejected' ? ' is-rejected' : request.statusCode === 'verified' ? ' is-approved' : ''}`}><span><AdminIcon name={request.statusCode === 'verified' ? 'check' : 'info'} size={18}/></span><div><small>ملاحظة المراجعة</small><b>{request.status}</b><p>{request.decisionReason}</p></div></div>}
          {(rejecting || requestingInfo) && !isDecided && <div className="admin-kyc-reject admin-kyc-reject--page"><label>{rejecting ? 'سبب الرفض' : 'المعلومات الإضافية المطلوبة'}<textarea rows="4" autoFocus value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} placeholder="اكتب ملاحظة واضحة للخبير..." /></label><div><button type="button" onClick={() => { setRejecting(false); setRequestingInfo(false); setDecisionReason(''); }}>إلغاء</button><button className={rejecting ? 'is-danger' : ''} type="button" disabled={!decisionReason.trim()} onClick={() => decide(rejecting ? 'rejected' : 'needs_information', notify)}>{rejecting ? 'تأكيد الرفض' : 'إرسال طلب المعلومات'}</button></div></div>}
          {!isDecided && <div className="admin-kyc-page-decision-actions"><div><AdminIcon name="info" size={17}/><span>يمكن طلب معلومات إضافية. القبول يتطلب مراجعة كل الملفات الموجودة.</span></div><div><button type="button" onClick={() => { setRequestingInfo(true); setRejecting(false); }}><AdminIcon name="info" size={17}/>طلب معلومات</button><button type="button" className="is-reject" onClick={() => { setRejecting(true); setRequestingInfo(false); }}><AdminIcon name="close" size={17}/>رفض الطلب</button><button type="button" className="is-approve" disabled={!allChecked} onClick={() => decide('verified', notify)}><AdminIcon name="check" size={17}/>قبول الطلب</button></div></div>}
        </section>
      </div>}
    </AdminPageFrame>
  );
}
