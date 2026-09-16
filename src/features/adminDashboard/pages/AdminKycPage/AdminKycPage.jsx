import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../../components/AdminIcon/AdminIcon';
import AdminStatusPill from '../../components/AdminStatusPill/AdminStatusPill';
import { getAdminKycRequests } from '../../data/adminKycData';
import '../../AdminAccess.css';

const filters = ['الكل', 'مُقدّم', 'قيد المراجعة', 'تحتاج معلومات', 'مقبول', 'مرفوض'];

export default function AdminKycPage() {
  const [requests, setRequests] = useState(() => getAdminKycRequests());
  const [filter, setFilter] = useState('الكل');
  const refresh = () => setRequests(getAdminKycRequests());
  const filteredRequests = useMemo(
    () => (filter === 'الكل' ? requests : requests.filter((request) => request.status === filter)),
    [filter, requests],
  );

  return (
    <AdminPageFrame
      activePage="kyc"
      eyebrow="Expert Verification"
      title="طلبات KYC"
      description="هذه القائمة تقرأ نفس طلب KYC الذي يرسله الخبير من لوحة الخبراء، دون نموذج بيانات منفصل للأدمن."
      icon="verified"
      actions={[{ label: 'تحديث الطلبات', icon: 'refresh', onClick: (notify) => { refresh(); notify('تم تحديث طلبات KYC من المصدر المشترك'); } }]}
    >
      {({ searchValue }) => {
        const term = searchValue.trim().toLowerCase();
        const visible = filteredRequests.filter((request) => !term || [request.id, request.name, request.email, request.domain, request.jurisdiction].join(' ').toLowerCase().includes(term));
        return <>
          <div className="admin-page-notice"><span><AdminIcon name="shield" size={20}/></span><div><b>نفس بيانات الخبير، نفس دورة المراجعة</b><p>الهوية والخبرة والمؤهلات والشهادات وعينات العمل المعروضة هنا تأتي من طلب الخبير نفسه، والقرار الذي تتخذه هنا ينعكس على حالة الطلب.</p></div></div>
          <section className="admin-data-panel admin-kyc-panel">
            <div className="admin-data-panel__header"><div><span className="admin-section-kicker"><AdminIcon name="verified" size={16}/> طابور التحقق</span><h2>طلبات توثيق الخبراء</h2><p>{visible.length} طلبات ضمن الفلتر الحالي</p></div></div>
            <div className="admin-filter-row" role="group" aria-label="تصفية طلبات KYC">{filters.map((option) => <button type="button" className={filter === option ? 'is-active' : ''} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div>
            <div className="admin-table-wrap"><table className="admin-records-table admin-kyc-table"><thead><tr><th>الخبير</th><th>الحالة</th><th>المجال</th><th>الاختصاص</th><th>المستندات</th><th>التقديم</th><th>الإجراء</th></tr></thead><tbody>
              {visible.map((request) => <tr key={request.id}>
                <td data-label="الخبير"><Link className="admin-record-identity" to={`/admin/kyc/${request.id}`}><b>{request.name}</b><span>{request.id} · {request.email}</span></Link></td>
                <td data-label="الحالة"><AdminStatusPill tone={request.tone}>{request.status}</AdminStatusPill></td>
                <td data-label="المجال">{request.domain}</td><td data-label="الاختصاص">{request.jurisdiction}</td><td data-label="المستندات">{request.documents.length} ملفات</td><td data-label="التقديم">{request.submitted}</td>
                <td data-label="الإجراء"><Link className="admin-inline-action is-primary" to={`/admin/kyc/${request.id}`}>{request.status === 'مقبول' || request.status === 'مرفوض' ? 'عرض القرار' : 'مراجعة الطلب'}</Link></td>
              </tr>)}
              {!visible.length && <tr><td className="admin-empty-state" colSpan="7"><AdminIcon name="search" size={28}/><b>لا توجد طلبات مطابقة</b><span>جرّب فلترًا مختلفًا أو حدّث القائمة بعد إرسال خبير لطلب جديد.</span></td></tr>}
            </tbody></table></div>
          </section>
        </>;
      }}
    </AdminPageFrame>
  );
}
