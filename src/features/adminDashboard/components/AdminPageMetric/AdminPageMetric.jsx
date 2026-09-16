import React from 'react';
import AdminIcon from '../AdminIcon/AdminIcon';

export default function AdminPageMetric({ metric }) {
  return (
    <article className={`admin-page-metric is-${metric.tone}`}>
      <span className="admin-page-metric__icon"><AdminIcon name={metric.icon} size={22}/></span>
      <div><small>{metric.label}</small><strong>{metric.value}</strong><p>{metric.helper}</p></div>
    </article>
  );
}
