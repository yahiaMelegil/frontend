import React from 'react';
import { operationalTrend } from '../../data/adminDashboardData';
import AdminIcon from '../AdminIcon/AdminIcon';

const maxValue = Math.max(...operationalTrend.flatMap((item) => [item.opened, item.resolved]));

export default function OperationsChart() {
  return (
    <section className="admin-panel admin-operations-chart" aria-labelledby="operations-chart-title">
      <div className="admin-panel__header">
        <div><span className="admin-section-kicker"><AdminIcon name="trendUp" size={16}/> أداء التشغيل</span><h2 id="operations-chart-title">الوارد مقابل المهام المنجزة</h2><p>متابعة توازن طوابير المراجعة خلال آخر 7 أيام.</p></div>
        <div className="admin-chart-summary"><span><b>150</b> واردة</span><span><b>145</b> منجزة</span></div>
      </div>
      <div className="admin-chart-legend"><span><i className="is-opened"/>مهام واردة</span><span><i className="is-resolved"/>مهام منجزة</span><strong><AdminIcon name="trendUp" size={15}/> معدل الإنجاز 96.7%</strong></div>
      <div className="admin-bar-chart" role="img" aria-label="رسم يقارن المهام الواردة والمنجزة خلال سبعة أيام">
        <div className="admin-bar-chart__grid" aria-hidden="true"><span/><span/><span/><span/></div>
        {operationalTrend.map((item) => (
          <div className="admin-bar-chart__group" key={item.label}>
            <div className="admin-bar-chart__bars">
              <span className="is-opened" style={{ height: `${(item.opened / maxValue) * 100}%` }}><b>{item.opened}</b></span>
              <span className="is-resolved" style={{ height: `${(item.resolved / maxValue) * 100}%` }}><b>{item.resolved}</b></span>
            </div>
            <small>{item.label}</small>
          </div>
        ))}
      </div>
      <div className="admin-chart-note"><span><AdminIcon name="spark" size={17}/></span><p><b>تحسّن واضح في زمن المعالجة</b> انخفض متوسط عمر المهمة المفتوحة 14% مقارنة بالأسبوع الماضي.</p></div>
    </section>
  );
}
