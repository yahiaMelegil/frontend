import React, { useEffect } from 'react';
import AdminIcon from '../AdminIcon/AdminIcon';

export default function AdminActionModal({ title, fields = [], onClose, onSubmit }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  return (
    <div className="admin-modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-action-modal" role="dialog" aria-modal="true" aria-labelledby="admin-action-title">
        <div className="admin-action-modal__header"><div><span><AdminIcon name="spark" size={20}/></span><div><small>إجراء تجريبي</small><h2 id="admin-action-title">{title}</h2></div></div><button type="button" onClick={onClose} aria-label="إغلاق"><AdminIcon name="close" size={19}/></button></div>
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <p className="admin-form-note"><AdminIcon name="info" size={18}/>لن تُرسل هذه البيانات إلى الخادم؛ النموذج مخصص لمعاينة تجربة الاستخدام.</p>
          {fields.map((field, index) => <label key={field}>{field}<input autoFocus={index === 0} required placeholder={`أدخل ${field}`} /></label>)}
          <label>ملاحظة داخلية<textarea rows="3" placeholder="أضف سياقًا يساعد المراجع التالي..." /></label>
          <div className="admin-action-modal__footer"><button type="button" onClick={onClose}>إلغاء</button><button className="is-primary" type="submit"><AdminIcon name="check" size={17}/>حفظ تجريبي</button></div>
        </form>
      </section>
    </div>
  );
}
