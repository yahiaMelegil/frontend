import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../../components/AdminIcon/AdminIcon';
import { getAdminRoles, permissionCatalog, saveAdminRoles } from '../../data/adminAccessStore';
import { PATHS } from '../../../../routes/paths';
import '../../AdminAccess.css';

const emptyRole = { name: '', description: '', permissions: [] };

function groupPermissions() {
  return permissionCatalog.reduce((groups, permission) => {
    if (!groups[permission.group]) groups[permission.group] = [];
    groups[permission.group].push(permission);
    return groups;
  }, {});
}

export default function AdminRolesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roles, setRoles] = useState(() => getAdminRoles());
  const [selectedRoleId, setSelectedRoleId] = useState(() => location.state?.selectedRoleId || getAdminRoles()[0]?.id || 'owner');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [draft, setDraft] = useState(emptyRole);
  const permissionGroups = useMemo(groupPermissions, []);
  const selectedRole = roles.find((role) => role.id === selectedRoleId) || roles[0];

  const persistRoles = (nextRoles) => {
    setRoles(nextRoles);
    saveAdminRoles(nextRoles);
  };

  const openEdit = (role) => {
    setEditingRoleId(role.id);
    setDraft({ name: role.name, description: role.description, permissions: [...role.permissions] });
    setEditorOpen(true);
  };

  const toggleDraftPermission = (permissionId) => {
    setDraft((current) => ({
      ...current,
      permissions: current.permissions.includes(permissionId)
        ? current.permissions.filter((item) => item !== permissionId)
        : [...current.permissions, permissionId],
    }));
  };

  const submitRole = (event, notify) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.permissions.length) return;

    const nextRoles = roles.map((role) => role.id === editingRoleId ? { ...role, ...draft } : role);
    persistRoles(nextRoles);
    setSelectedRoleId(editingRoleId);
    notify('تم تحديث الـRole وصلاحياتها محليًا للمعاينة');
    setEditorOpen(false);
  };

  return (
    <AdminPageFrame
      activePage="roles"
      eyebrow="Role-Based Access Control"
      title="الأدوار والصلاحيات"
      description="أنشئ Role محددة الغرض، ثم اختر Permissions التي تحتاجها فقط. لا يحصل أي حساب إداري على صلاحيات خارج الـRole المعيّنة له."
      icon="lock"
      actions={[{ label: 'إنشاء Role', icon: 'plus', onClick: () => navigate(PATHS.ADMIN_ROLE_CREATE) }]}
    >
      {({ notify }) => <>
        <div className="admin-page-notice">
          <span><AdminIcon name="shield" size={20}/></span>
          <div><b>RBAC مبني على أقل صلاحية</b><p>Super Admin محمي ولا يمكن تقليل صلاحياته من هذه الواجهة. بقية الأدوار تحصل فقط على الصلاحيات المحددة لها.</p></div>
        </div>

        <div className="admin-rbac-layout">
          <section className="admin-rbac-roles" aria-label="قائمة الأدوار">
            <div className="admin-access-section-head"><div><span>Roles</span><h2>الأدوار الحالية</h2></div><small>{roles.length} أدوار</small></div>
            <div className="admin-role-list">
              {roles.map((role) => (
                <button
                  type="button"
                  className={`admin-role-list__item${selectedRole?.id === role.id ? ' is-active' : ''}`}
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <span className="admin-role-list__icon"><AdminIcon name={role.protected ? 'shield' : 'key'} size={18}/></span>
                  <span className="admin-role-list__copy"><b>{role.name}</b><small>{role.permissions.length} صلاحيات</small></span>
                  <AdminIcon name="chevron" size={15}/>
                </button>
              ))}
            </div>
          </section>

          <section className="admin-rbac-detail" aria-label="تفاصيل الدور المحدد">
            <div className="admin-access-section-head is-detail">
              <div><span>Permissions</span><h2>{selectedRole?.name}</h2><p>{selectedRole?.description}</p></div>
              {selectedRole && !selectedRole.protected && <button className="admin-page-button" type="button" onClick={() => openEdit(selectedRole)}><AdminIcon name="edit" size={17}/>تعديل الصلاحيات</button>}
            </div>
            <div className="admin-permission-summary-grid">
              {Object.entries(permissionGroups).map(([group, permissions]) => {
                const enabled = permissions.filter((permission) => selectedRole?.permissions.includes(permission.id));
                if (!enabled.length) return null;
                return (
                  <div className="admin-permission-summary" key={group}>
                    <div><b>{group}</b><small>{enabled.length} من {permissions.length}</small></div>
                    <ul>{enabled.map((permission) => <li key={permission.id}><AdminIcon name="check" size={14}/><span>{permission.label}</span>{permission.sensitive && <em>حساسة</em>}</li>)}</ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {editorOpen && (
          <div className="admin-modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditorOpen(false)}>
            <section className="admin-role-editor" role="dialog" aria-modal="true" aria-labelledby="role-editor-title">
              <div className="admin-action-modal__header">
                <div><span><AdminIcon name="key" size={20}/></span><div><small>Role-Based Access</small><h2 id="role-editor-title">تعديل Role</h2></div></div>
                <button type="button" onClick={() => setEditorOpen(false)} aria-label="إغلاق"><AdminIcon name="close" size={19}/></button>
              </div>
              <form onSubmit={(event) => submitRole(event, notify)}>
                <div className="admin-rbac-form-grid">
                  <label>اسم الـRole<input required value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="مثال: مراجع KYC" /></label>
                  <label>وصف مختصر<textarea required rows="2" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="ما الغرض التشغيلي من هذا الدور؟" /></label>
                </div>
                <div className="admin-permission-picker">
                  <div className="admin-permission-picker__head"><div><b>حدد الصلاحيات</b><span>اختر الحد الأدنى المطلوب لأداء المهمة.</span></div><strong>{draft.permissions.length} محددة</strong></div>
                  {Object.entries(permissionGroups).map(([group, permissions]) => (
                    <fieldset key={group}>
                      <legend>{group}</legend>
                      <div className="admin-permission-picker__grid">
                        {permissions.map((permission) => (
                          <label className={`admin-permission-check${draft.permissions.includes(permission.id) ? ' is-selected' : ''}`} key={permission.id}>
                            <input type="checkbox" checked={draft.permissions.includes(permission.id)} onChange={() => toggleDraftPermission(permission.id)} />
                            <span><b>{permission.label}</b><small>{permission.description}</small></span>
                            {permission.sensitive && <em>صلاحية حساسة</em>}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <div className="admin-role-editor__footer"><button type="button" onClick={() => setEditorOpen(false)}>إلغاء</button><button className="is-primary" type="submit" disabled={!draft.name.trim() || !draft.permissions.length}><AdminIcon name="save" size={17}/>حفظ التعديلات</button></div>
              </form>
            </section>
          </div>
        )}
      </>}
    </AdminPageFrame>
  );
}
