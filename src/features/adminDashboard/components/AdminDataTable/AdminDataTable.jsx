import React, { useEffect, useMemo, useState } from 'react';
import AdminIcon from '../AdminIcon/AdminIcon';
import AdminStatusPill from '../AdminStatusPill/AdminStatusPill';

const PAGE_SIZE = 4;

export default function AdminDataTable({ config, searchValue, onOpenDetails, notify }) {
  const [filter, setFilter] = useState('الكل');
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(true);

  const filteredRows = useMemo(() => {
    const term = searchValue.trim().toLocaleLowerCase('ar');
    return config.rows
      .filter((row) => filter === 'الكل' || row.status === filter)
      .filter((row) => !term || [row.id, row.title, row.subtitle, row.status, ...Object.values(row.data)].join(' ').toLocaleLowerCase('ar').includes(term))
      .sort((a, b) => (ascending ? 1 : -1) * a.title.localeCompare(b.title, 'ar'));
  }, [ascending, config.rows, filter, searchValue]);

  useEffect(() => setPage(1), [filter, searchValue, ascending]);
  const pages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="admin-data-panel" aria-labelledby={`${config.id}-table-title`}>
      <div className="admin-data-panel__header">
        <div><span className="admin-section-kicker"><AdminIcon name="list" size={16}/> سجل تشغيلي</span><h2 id={`${config.id}-table-title`}>قائمة {config.title}</h2><p>{filteredRows.length} من أصل {config.rows.length} {config.recordLabel}</p></div>
        <button className="admin-sort-button" type="button" onClick={() => setAscending((value) => !value)}><AdminIcon name="filter" size={17}/>ترتيب: {ascending ? 'أ — ي' : 'ي — أ'}</button>
      </div>
      <div className="admin-filter-row" role="group" aria-label="تصفية النتائج">
        {config.filters.map((option) => <button className={filter === option ? 'is-active' : ''} type="button" key={option} onClick={() => setFilter(option)}>{option}</button>)}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-records-table">
          <thead><tr><th>{config.recordLabel}</th><th>الحالة</th>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th><span className="sr-only">الإجراءات</span></th></tr></thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td data-label={config.recordLabel}><button className="admin-record-identity" type="button" onClick={() => onOpenDetails(row)}><b>{row.title}</b><span>{row.id} · {row.subtitle}</span></button></td>
                <td data-label="الحالة"><AdminStatusPill tone={row.tone}>{row.status}</AdminStatusPill></td>
                {config.columns.map((column) => <td key={column.key} data-label={column.label}>{row.data[column.key]}</td>)}
                <td data-label="الإجراءات"><button className="admin-row-action" type="button" aria-label={`عرض ${row.id}`} onClick={() => onOpenDetails(row)}><AdminIcon name="eye" size={18}/></button></td>
              </tr>
            ))}
            {!visibleRows.length && <tr><td className="admin-empty-state" colSpan={config.columns.length + 3}><AdminIcon name="search" size={28}/><b>لا توجد نتائج مطابقة</b><span>جرّب تعديل البحث أو مرشح الحالة.</span></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination"><span>صفحة {page} من {pages}</span><div><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>السابق</button><button type="button" disabled={page === pages} onClick={() => setPage((value) => value + 1)}>التالي</button></div></div>
    </section>
  );
}
