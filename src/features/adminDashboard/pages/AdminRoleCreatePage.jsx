import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageFrame from '../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../components/AdminIcon/AdminIcon';
import { getAdminRoles, permissionCatalog, saveAdminRoles } from '../data/adminAccessStore';
import { PATHS } from '../../../routes/paths';
import '../AdminAccess.css';

const emptyRole = { name: '', description: '', permissions: [] };

function groupPermissions() {
  return permissionCatalog.reduce((groups, permission) => {
    if (!groups[permission.group]) groups[permission.group] = [];
    groups[permission.group].push(permission);
    return groups;
  }, {});
}

export default function AdminRoleCreatePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(emptyRole);
  const [submitted, setSubmitted] = useState(false);
  const permissionGroups = useMemo(groupPermissions, []);

  const togglePermission = (permissionId) => {
    setDraft((current) => ({
      ...current,
      permissions: current.permissions.includes(permissionId)
        ? current.permissions.filter((item) => item !== permissionId)
        : [...current.permissions, permissionId],
    }));
  };

  const selectGroup = (permissions) => {
    const ids = permissions.map((permission) => permission.id);
    const groupSelected = ids.every((id) => draft.permissions.includes(id));
    setDraft((current) => ({
      ...current,
      permissions: groupSelected
        ? current.permissions.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current.permissions, ...ids])),
    }));
  };

  const submitRole = (event, notify) => {
    event.preventDefault();
    setSubmitted(true);
    if (!draft.name.trim() || !draft.description.trim() || !draft.permissions.length) return;

    const roles = getAdminRoles();
    const id = `role-${Date.now()}`;
    const nextRole = {
      id,
      name: draft.name.trim(),
      description: draft.description.trim(),
      permissions: draft.permissions,
      protected: false,
    };
    saveAdminRoles([...roles, nextRole]);
    notify('تم إنشاء الـRole بنجاح وأصبحت متاحة لتعيينها إلى Sub-Admin');
    window.setTimeout(() => navigate(PATHS.ADMIN_ROLES, { state: { selectedRoleId: id } }), 650);
  };

  return (
    <AdminPageFrame
      activePage="roles"
      eyebrow="Role-Based Access Control"
      title="إنشاء Role جديدة"
      description="حدد وظيفة الدور أولًا، ثم امنحه أقل مجموعة Permissions يحتاجها لتنفيذ مهمته. يمكنك تعديل الصلاحيات لاحقًا من صفحة الأدوار."
      icon="key"
      actions={[{ label: 'العودة للأدوار', icon: 'arrow', onClick: () => navigate(PATHS.ADMIN_ROLES) }]}
    >
      {({ notify }) => (
        <form className="admin-role-create-page" onSubmit={(event) => submitRole(event, notify)} noValidate>
          <section className="admin-role-create-card">
            <div className="admin-access-section-head is-detail">
              <div><span>Role Details</span><h2>بيانات الدور</h2><p>استخدم اسمًا واضحًا يصف المهمة الإدارية، وليس اسم الشخص الذي سيحصل على الدور.</p></div>
            </div>
            <div className="admin-role-create-card__body admin-rbac-form-grid">
              <label>
                اسم الـRole
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="مثال: مراجع KYC"
                  aria-invalid={submitted && !draft.name.trim()}
                />
                {submitted && !draft.name.trim() && <small className="admin-field-error">اكتب اسمًا واضحًا للدور.</small>}
              </label>
              <label>
                وصف مختصر
                <textarea
                  rows="3"
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                  placeholder="ما المهمة التي يؤديها هذا الدور؟"
                  aria-invalid={submitted && !draft.description.trim()}
                />
                {submitted && !draft.description.trim() && <small className="admin-field-error">أضف وصفًا مختصرًا يوضح الغرض من الدور.</small>}
              </label>
            </div>
          </section>

          <section className="admin-role-create-card">
            <div className="admin-access-section-head is-detail">
              <div><span>Permissions</span><h2>تحديد الصلاحيات</h2><p>اختر فقط الصلاحيات التي يحتاجها هذا الدور. الصلاحيات الحساسة موضحة بوسم مستقل.</p></div>
              <strong className="admin-role-create-count">{draft.permissions.length} محددة</strong>
            </div>
            <div className="admin-role-create-card__body admin-permission-picker">
              {Object.entries(permissionGroups).map(([group, permissions]) => {
                const groupIds = permissions.map((permission) => permission.id);
                const selectedCount = groupIds.filter((id) => draft.permissions.includes(id)).length;
                const allSelected = selectedCount === permissions.length;
                return (
                  <fieldset key={group}>
                    <legend>{group}</legend>
                    <div className="admin-permission-group-head">
                      <span>{selectedCount} من {permissions.length} محددة</span>
                      <button type="button" onClick={() => selectGroup(permissions)}>{allSelected ? 'إلغاء تحديد المجموعة' : 'تحديد المجموعة'}</button>
                    </div>
                    <div className="admin-permission-picker__grid">
                      {permissions.map((permission) => (
                        <label className={`admin-permission-check${draft.permissions.includes(permission.id) ? ' is-selected' : ''}`} key={permission.id}>
                          <input type="checkbox" checked={draft.permissions.includes(permission.id)} onChange={() => togglePermission(permission.id)} />
                          <span><b>{permission.label}</b><small>{permission.description}</small></span>
                          {permission.sensitive && <em>صلاحية حساسة</em>}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
              {submitted && !draft.permissions.length && <p className="admin-field-error admin-field-error--block"><AdminIcon name="risk" size={16}/>حدد صلاحية واحدة على الأقل قبل إنشاء الدور.</p>}
            </div>
          </section>

          <footer className="admin-role-create-actions">
            <div><AdminIcon name="shield" size={18}/><span>يمكن تعيين هذا الـRole إلى Sub-Admin بعد الحفظ مباشرة.</span></div>
            <div>
              <button type="button" onClick={() => navigate(PATHS.ADMIN_ROLES)}>إلغاء</button>
              <button className="is-primary" type="submit"><AdminIcon name="save" size={17}/>إنشاء Role</button>
            </div>
          </footer>
        </form>
      )}
    </AdminPageFrame>
  );
}
