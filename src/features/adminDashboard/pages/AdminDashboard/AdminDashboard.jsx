import React, { useEffect, useMemo, useState } from 'react';
import { dashboardMetrics, quickActions, systemHealth } from '../../data/adminDashboardData';
import AdminShell from '../../components/AdminShell/AdminShell';
import AdminIcon from '../../components/AdminIcon/AdminIcon';
import { useAdminI18n } from '../../i18n/AdminI18nContext';
import MetricCard from '../../components/MetricCard/MetricCard';
import ReviewQueue from '../../components/ReviewQueue/ReviewQueue';
import OperationsChart from '../../components/OperationsChart/OperationsChart';
import AuditTimeline from '../../components/AuditTimeline/AuditTimeline';
import '../../AdminDashboard.css';

function AdminWelcomeHeader() {
  const { language, t } = useAdminI18n();
  const adminName = t('topbar.platformAdmin');
  const formattedDate = useMemo(() => new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date()), [language]);

  return (
    <header className="admin-page-heading">
      <div>
        <nav aria-label={t('dashboard.breadcrumb')}><span>{t('dashboard.administration')}</span><AdminIcon name="chevron" size={14}/><strong>{t('dashboard.overview')}</strong></nav>
        <h1>{t('dashboard.welcome', { name: adminName })}</h1>
        <p>{t('dashboard.description')}</p>
      </div>
      <div className="admin-page-heading__date"><span><AdminIcon name="clock" size={18}/></span><div><small>{t('dashboard.date')}</small><b>{formattedDate}</b></div></div>
    </header>
  );
}

export default function AdminDashboard() {
  const [searchValue, setSearchValue] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleAction = (message) => setToast(message);

  return (
    <div className="admin-dashboard-page">
      <AdminShell activePage="overview" searchValue={searchValue} onSearchChange={setSearchValue} onAction={handleAction}>
        <AdminWelcomeHeader />

        <section className="admin-attention-banner" aria-label="ملخص الأولوية">
          <div className="admin-attention-banner__copy">
            <span className="admin-attention-banner__icon"><AdminIcon name="shield" size={26}/></span>
            <div><span>موجز الأولوية</span><h2>لديك 5 مهام حسّاسة تحتاج قرارًا قبل نهاية اليوم.</h2><p>طلبا تحقق متأخران، شكوى عاجلة، وإشارتا مخاطر بانتظار المراجعة البشرية.</p></div>
          </div>
          <div className="admin-attention-banner__actions">
            <span><i/> آخر مزامنة قبل دقيقة</span>
            <button type="button" onClick={() => handleAction('فتح قائمة المهام الحساسة')}>ابدأ المراجعة <AdminIcon name="arrow" size={18}/></button>
          </div>
        </section>

        <section className="admin-metrics-grid" aria-label="مؤشرات التشغيل الرئيسية">
          {dashboardMetrics.map((metric) => <MetricCard key={metric.id} metric={metric} onAction={handleAction} />)}
        </section>

        <div className="admin-dashboard-grid admin-dashboard-grid--queue">
          <ReviewQueue searchValue={searchValue} onAction={handleAction} />
          <aside className="admin-side-stack" aria-label="الإجراءات السريعة">
            <section className="admin-panel admin-quick-actions">
              <div className="admin-panel__header"><div><span className="admin-section-kicker"><AdminIcon name="spark" size={16}/> وصول مباشر</span><h2>إجراءات سريعة</h2><p>المهام الإدارية الأكثر استخدامًا.</p></div></div>
              <div className="admin-quick-actions__list">
                {quickActions.map((action) => (
                  <button type="button" key={action.id} onClick={() => handleAction(action.label)}>
                    <span><AdminIcon name={action.icon} size={20}/></span>
                    <div><b>{action.label}</b><small>{action.helper}</small></div>
                    <AdminIcon name="chevron" size={17}/>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-access-card">
              <div className="admin-access-card__head"><span><AdminIcon name="lock" size={20}/></span><i>وصول مقيّد</i></div>
              <h2>صلاحياتك مضبوطة حسب المهمة</h2>
              <p>الوصول الاستثنائي محدود زمنيًا، يتطلب سببًا موثقًا، ويخضع لمراجعة لاحقة.</p>
              <button type="button" onClick={() => handleAction('مراجعة صلاحياتي الحالية')}>راجع صلاحياتك <AdminIcon name="arrow" size={17}/></button>
            </section>
          </aside>
        </div>

        <div className="admin-dashboard-grid admin-dashboard-grid--analytics">
          <OperationsChart />
          <section className="admin-panel admin-health-panel" aria-labelledby="health-title">
            <div className="admin-panel__header"><div><span className="admin-section-kicker"><AdminIcon name="activity" size={16}/> مراقبة المنصة</span><h2 id="health-title">سلامة الخدمات</h2><p>مؤشرات الجودة اللازمة لاستمرارية التشغيل.</p></div><span className="admin-live-badge"><i/> مباشر</span></div>
            <div className="admin-health-score"><div><strong>99.96%</strong><span>الجاهزية العامة</span></div><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42"/><circle className="is-value" cx="50" cy="50" r="42" pathLength="100"/></svg></div>
            <div className="admin-health-list">
              {systemHealth.map((item) => (
                <div key={item.id}><span><i/></span><div><b>{item.label}</b><small>{item.detail}</small></div><strong>{item.value}</strong></div>
              ))}
            </div>
            <button className="admin-secondary-button" type="button" onClick={() => handleAction('عرض تفاصيل سلامة المنصة')}>عرض تفاصيل النظام <AdminIcon name="external" size={17}/></button>
          </section>
        </div>

        <AuditTimeline onAction={handleAction} />

        {toast && <div className="admin-toast" role="status"><span><AdminIcon name="check" size={18}/></span><p>{toast}</p><button type="button" aria-label="إغلاق الرسالة" onClick={() => setToast('')}><AdminIcon name="close" size={17}/></button></div>}
      </AdminShell>
    </div>
  );
}
