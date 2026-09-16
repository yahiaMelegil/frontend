import React from 'react';
import AdminIcon from '../AdminIcon/AdminIcon';

const getSparklinePoints = (points) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return points.map((point, index) => `${(index / (points.length - 1)) * 120},${34 - ((point - min) / range) * 27}`).join(' ');
};

export default function MetricCard({ metric, onAction }) {
  return (
    <article className={`admin-metric-card is-${metric.tone}`}>
      <div className="admin-metric-card__top">
        <span className="admin-metric-card__icon"><AdminIcon name={metric.icon} size={22} /></span>
        <span className="admin-metric-card__change">{metric.change}</span>
      </div>
      <div className="admin-metric-card__body">
        <p>{metric.label}</p>
        <strong>{metric.value}</strong>
      </div>
      <div className="admin-metric-card__bottom">
        <span>{metric.helper}</span>
        <svg viewBox="0 0 120 38" role="img" aria-label={`اتجاه ${metric.label}`}>
          <polyline points={getSparklinePoints(metric.points)} />
        </svg>
      </div>
      <button type="button" aria-label={`فتح ${metric.label}`} onClick={() => onAction(metric.label)} />
    </article>
  );
}
