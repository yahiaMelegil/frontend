import React, { useEffect } from 'react';
import AdminIcon from '../AdminIcon/AdminIcon';
import AdminStatusPill from '../AdminStatusPill/AdminStatusPill';

export default function AdminDetailsDrawer({ config, item, onClose, notify }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  if (!item) return null;
  return (
    <div className="admin-drawer-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="admin-details-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="admin-details-drawer__head"><div><small>{config.recordLabel} · {item.id}</small><h2 id="drawer-title">{item.title}</h2><AdminStatusPill tone={item.tone}>{item.status}</AdminStatusPill></div><button type="button" onClick={onClose} aria-label="إغلاق"><AdminIcon name="close" size={20}/></button></div>
        <div className="admin-details-drawer__body">
          <p className="admin-drawer-summary">{item.subtitle}</p>
          <section><h3>ملخص السجل</h3><dl>{config.columns.map((column) => <div key={column.key}><dt>{column.label}</dt><dd>{item.data[column.key]}</dd></div>)}</dl></section>
          <section><h3>سجل الحركة التجريبي</h3><ol className="admin-mini-timeline"><li><i/><div><b>تم تحديث الحالة</b><small>قبل 18 دقيقة · مسؤول مخوّل</small></div></li><li><i/><div><b>تمت مراجعة نطاق الوصول</b><small>قبل ساعة · مسجل في التدقيق</small></div></li><li><i/><div><b>تم إنشاء السجل</b><small>وفق سياسة الإصدار الحالية</small></div></li></ol></section>
          <p className="admin-form-note"><AdminIcon name="lock" size={18}/>{config.notice}</p>
        </div>
        <div className="admin-details-drawer__footer"><button type="button" onClick={() => notify(`تم نسخ مرجع ${item.id} تجريبيًا`)}>نسخ المرجع</button><button className="is-primary" type="button" onClick={() => notify(`تم فتح إجراء ${item.id} تجريبيًا`)}>بدء إجراء</button></div>
      </aside>
    </div>
  );
}
