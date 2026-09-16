import React, { useMemo, useState } from 'react';
import { queueFilters, reviewQueue } from '../../data/adminDashboardData';
import AdminIcon from '../AdminIcon/AdminIcon';
import StatusBadge from '../StatusBadge/StatusBadge';

const matchesFilter = (item, filter) => {
  if (filter === 'urgent') return item.priority === 'عاجل' || item.priority === 'مرتفع';
  if (filter === 'verification') return item.type.includes('تحقق');
  if (filter === 'trust') return ['شكوى سلوك', 'مراجعة مخاطر'].includes(item.type);
  return true;
};

export default function ReviewQueue({ searchValue, onAction }) {
  const [filter, setFilter] = useState('all');
  const filteredItems = useMemo(() => {
    const query = searchValue.trim().toLocaleLowerCase('ar');
    return reviewQueue.filter((item) => {
      const searchable = `${item.id} ${item.type} ${item.title} ${item.description} ${item.owner}`.toLocaleLowerCase('ar');
      return matchesFilter(item, filter) && (!query || searchable.includes(query));
    });
  }, [filter, searchValue]);

  return (
    <section className="admin-panel admin-review-queue" aria-labelledby="review-queue-title">
      <div className="admin-panel__header admin-review-queue__header">
        <div><span className="admin-section-kicker"><AdminIcon name="activity" size={16}/> قائمة الأولويات</span><h2 id="review-queue-title">مهام تتطلب مراجعة</h2><p>مرتبة حسب مستوى الخطورة ووقت الاستجابة المطلوب.</p></div>
        <button className="admin-text-button" type="button" onClick={() => onAction('عرض كل طوابير المراجعة')}>عرض الكل <AdminIcon name="arrow" size={17}/></button>
      </div>

      <div className="admin-queue-filters" aria-label="تصفية قائمة المراجعة">
        <AdminIcon name="filter" size={17}/>
        {queueFilters.map((item) => (
          <button className={filter === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>
        ))}
      </div>

      {filteredItems.length ? (
        <div className="admin-queue-table-wrap">
          <table className="admin-queue-table">
            <thead><tr><th>المهمة</th><th>الأولوية</th><th>الحالة</th><th>المسؤول</th><th>العمر</th><th><span className="sr-only">الإجراء</span></th></tr></thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button className="admin-queue-task" type="button" onClick={() => onAction(`فتح المهمة ${item.id}`)}>
                      <span className="admin-queue-task__icon"><AdminIcon name={item.icon} size={20}/></span>
                      <span><b>{item.title}</b><small>{item.type} · {item.id}</small><em>{item.description}</em></span>
                    </button>
                  </td>
                  <td><span className={`admin-priority is-${item.priority === 'عاجل' ? 'urgent' : item.priority === 'مرتفع' ? 'high' : 'medium'}`}>{item.priority}</span></td>
                  <td><StatusBadge>{item.status}</StatusBadge></td>
                  <td><span className="admin-table-secondary">{item.owner}</span></td>
                  <td><span className="admin-table-age"><AdminIcon name="clock" size={15}/>{item.age}</span></td>
                  <td><button className="admin-row-action" type="button" aria-label={`فتح ${item.id}`} onClick={() => onAction(`فتح المهمة ${item.id}`)}><AdminIcon name="chevron" size={18}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty-state"><span><AdminIcon name="search" size={25}/></span><b>لا توجد نتائج مطابقة</b><p>جرّب عبارة أخرى أو غيّر عامل التصفية.</p></div>
      )}
    </section>
  );
}
