import React, { useEffect, useState } from 'react';
import AdminShell from '../AdminShell/AdminShell';
import AdminIcon from '../AdminIcon/AdminIcon';
import '../../AdminDashboard.css';
import '../../AdminPages.css';

export default function AdminPageFrame({ activePage, eyebrow, title, description, icon, actions = [], children }) {
  const [searchValue, setSearchValue] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message) => setToast(message);

  return (
    <div className="admin-dashboard-page">
      <AdminShell activePage={activePage} searchValue={searchValue} onSearchChange={setSearchValue} onAction={notify}>
        <header className="admin-module-heading">
          <div className="admin-module-heading__copy">
            <nav aria-label="مسار الصفحة"><span>الإدارة</span><AdminIcon name="chevron" size={14}/><strong>{title}</strong></nav>
            <span className="admin-module-heading__eyebrow"><AdminIcon name={icon} size={16}/>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="admin-module-heading__actions">
            {actions.map((action, index) => (
              <button
                key={action.label}
                className={index === 0 ? 'admin-page-button is-primary' : 'admin-page-button'}
                type="button"
                onClick={() => action.onClick ? action.onClick(notify) : notify(action.message || `${action.label} — واجهة تجريبية`)}
              >
                <AdminIcon name={action.icon || 'spark'} size={18}/>{action.label}
              </button>
            ))}
          </div>
        </header>
        {children({ searchValue, notify })}
        {toast && <div className="admin-toast" role="status"><span><AdminIcon name="check" size={18}/></span><p>{toast}</p><button type="button" aria-label="إغلاق الرسالة" onClick={() => setToast('')}><AdminIcon name="close" size={17}/></button></div>}
      </AdminShell>
    </div>
  );
}
