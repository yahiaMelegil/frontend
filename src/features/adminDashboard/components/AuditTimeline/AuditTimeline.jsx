import React from 'react';
import { auditEvents } from '../../data/adminDashboardData';
import AdminIcon from '../AdminIcon/AdminIcon';

export default function AuditTimeline({ onAction }) {
  return (
    <section className="admin-panel admin-audit-panel" aria-labelledby="audit-title">
      <div className="admin-panel__header">
        <div><span className="admin-section-kicker"><AdminIcon name="audit" size={16}/> سجل غير قابل للتعديل</span><h2 id="audit-title">آخر الإجراءات الإدارية</h2><p>من قام بالإجراء، ومتى، وما الذي تغيّر.</p></div>
        <button className="admin-icon-button is-soft" type="button" aria-label="فتح سجل التدقيق" onClick={() => onAction('فتح سجل التدقيق الكامل')}><AdminIcon name="external" size={19}/></button>
      </div>
      <div className="admin-audit-list">
        {auditEvents.map((event) => (
          <article key={event.id}>
            <span className={`admin-audit-list__icon is-${event.tone}`}><AdminIcon name={event.icon} size={18}/></span>
            <div><b>{event.action}</b><p><span>{event.actor}</span><i/> <span>{event.time}</span></p></div>
            <small>{event.id}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
