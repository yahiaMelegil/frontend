import React, { useMemo, useState } from 'react';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../../components/AdminIcon/AdminIcon';
import AdminStatusPill from '../../components/AdminStatusPill/AdminStatusPill';
import { getAdminRoles, getSubAdmins, saveSubAdmins } from '../../data/adminAccessStore';
import '../../AdminAccess.css';

const statusTone = (status) => status === 'نشط' ? 'success' : status === 'موقوف' ? 'danger' : 'warning';

export default function AdminSubAdminsPage() {
  const [admins, setAdmins] = useState(() => getSubAdmins());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', roleId: '' });
  const roles = useMemo(() => getAdminRoles().filter((role) => !role.protected), [modalOpen, admins]);

  const createSubAdmin = (event, notify) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.roleId) return;
    const next = [{ id: `ADM-${Date.now().toString().slice(-4)}`, ...form, status: 'دعوة معلّقة', lastActive: 'لم يسجل الدخول بعد' }, ...admins];
    setAdmins(next);
    saveSubAdmins(next);
    setForm({ name: '', email: '', roleId: '' });
    setModalOpen(false);
    notify('تم إنشاء Sub-Admin وربطه بالـRole المحددة محليًا للمعاينة');
  };

  const updateStatus = (adminId, notify) => {
    const next = admins.map((admin) => admin.id === adminId ? { ...admin, status: admin.status === 'موقوف' ? 'نشط' : 'موقوف' } : admin);
    setAdmins(next);
    saveSubAdmins(next);
    notify('تم تحديث حالة الحساب الإداري محليًا');
  };

  const roleName = (roleId) => getAdminRoles().find((role) => role.id === roleId)?.name || 'Role غير متاحة';

  return (
    <AdminPageFrame
      activePage="subadmins"
      eyebrow="Delegated Administration"
      title="Sub-Admins"
      description="أنشئ حسابات إدارية فرعية واربط كل حساب بـRole موجودة مسبقًا. الصلاحيات لا تُمنح للحساب مباشرة؛ مصدرها الوحيد هو الـRole."
      icon="userCheck"
      actions={[{ label: 'إنشاء Sub-Admin', icon: 'plus', onClick: () => setModalOpen(true) }]}
    >
      {({ notify }) => <>
        <div className="admin-page-notice"><span><AdminIcon name="shield" size={20}/></span><div><b>تعيين Role واحدة واضحة</b><p>أي تعديل على Permissions الخاصة بالـRole ينعكس على الحسابات المرتبطة بها عند ربط النظام بالـBackend.</p></div></div>

        <section className="admin-data-panel admin-subadmins-panel">
          <div className="admin-data-panel__header"><div><span className="admin-section-kicker"><AdminIcon name="users" size={16}/> الإدارة المفوضة</span><h2>الحسابات الإدارية الفرعية</h2><p>{admins.length} حسابات مرتبطة بأدوار محددة</p></div></div>
          <div className="admin-table-wrap">
            <table className="admin-records-table admin-subadmins-table">
              <thead><tr><th>الحساب</th><th>Role</th><th>الحالة</th><th>آخر نشاط</th><th>الإجراء</th></tr></thead>
              <tbody>{admins.map((admin) => <tr key={admin.id}>
                <td data-label="الحساب"><div className="admin-subadmin-identity"><span><AdminIcon name="person" size={18}/></span><div><b>{admin.name}</b><small>{admin.email} · {admin.id}</small></div></div></td>
                <td data-label="Role"><span className="admin-role-chip"><AdminIcon name="key" size={14}/>{roleName(admin.roleId)}</span></td>
                <td data-label="الحالة"><AdminStatusPill tone={statusTone(admin.status)}>{admin.status}</AdminStatusPill></td>
                <td data-label="آخر نشاط">{admin.lastActive}</td>
                <td data-label="الإجراء"><button className="admin-inline-action" type="button" onClick={() => updateStatus(admin.id, notify)}>{admin.status === 'موقوف' ? 'إعادة التفعيل' : 'إيقاف'}</button></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        {modalOpen && <div className="admin-modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <section className="admin-role-editor admin-subadmin-modal" role="dialog" aria-modal="true" aria-labelledby="sub-admin-title">
            <div className="admin-action-modal__header"><div><span><AdminIcon name="userCheck" size={20}/></span><div><small>Sub-Admin</small><h2 id="sub-admin-title">إنشاء حساب إداري فرعي</h2></div></div><button type="button" onClick={() => setModalOpen(false)} aria-label="إغلاق"><AdminIcon name="close" size={19}/></button></div>
            <form onSubmit={(event) => createSubAdmin(event, notify)}>
              <p className="admin-form-note"><AdminIcon name="info" size={18}/>أنشئ الـRole أولًا من صفحة الأدوار والصلاحيات، ثم عيّنها للحساب هنا.</p>
              <div className="admin-rbac-form-grid">
                <label>الاسم الكامل<input autoFocus required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="اسم المسؤول" /></label>
                <label>البريد الإلكتروني<input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="admin@example.com" /></label>
                <label className="is-full">Role<select required value={form.roleId} onChange={(event) => setForm((current) => ({ ...current, roleId: event.target.value }))}><option value="">اختر Role...</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
              </div>
              {!roles.length && <p className="admin-form-note is-warning"><AdminIcon name="risk" size={18}/>لا توجد Roles قابلة للتعيين. أنشئ Role جديدة أولًا.</p>}
              <div className="admin-role-editor__footer"><button type="button" onClick={() => setModalOpen(false)}>إلغاء</button><button className="is-primary" type="submit" disabled={!roles.length}><AdminIcon name="check" size={17}/>إنشاء وإرسال دعوة</button></div>
            </form>
          </section>
        </div>}
      </>}
    </AdminPageFrame>
  );
}
