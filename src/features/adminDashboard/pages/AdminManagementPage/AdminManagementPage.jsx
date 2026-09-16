import React, { useState } from 'react';
import { managementPages } from '../../data/adminPagesData';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminPageMetric from '../../components/AdminPageMetric/AdminPageMetric';
import AdminDataTable from '../../components/AdminDataTable/AdminDataTable';
import AdminActionModal from '../../components/AdminActionModal/AdminActionModal';
import AdminDetailsDrawer from '../../components/AdminDetailsDrawer/AdminDetailsDrawer';
import AdminIcon from '../../components/AdminIcon/AdminIcon';

export default function AdminManagementPage({ pageKey }) {
  const config = managementPages[pageKey];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!config) return null;
  const primaryAction = config.action.mode === 'modal'
    ? { ...config.action, onClick: () => setModalOpen(true) }
    : { ...config.action, message: `تم تجهيز ${config.action.label} تجريبيًا` };

  return (
    <AdminPageFrame activePage={config.id} eyebrow={config.eyebrow} title={config.title} description={config.description} icon={config.icon} actions={[primaryAction, { label: 'تحديث البيانات', icon: 'refresh', message: 'تم تحديث البيانات التجريبية' }]}>
      {({ searchValue, notify }) => <>
        <section className="admin-page-metrics" aria-label="ملخص الصفحة">{config.metrics.map((metric) => <AdminPageMetric key={metric.label} metric={metric}/>)}</section>
        <div className="admin-page-notice"><span><AdminIcon name="shield" size={20}/></span><div><b>وصول مضبوط حسب المهمة</b><p>{config.notice}</p></div></div>
        <AdminDataTable config={config} searchValue={searchValue} onOpenDetails={setSelectedItem} notify={notify}/>
        {modalOpen && <AdminActionModal title={config.action.modalTitle} fields={config.action.fields} onClose={() => setModalOpen(false)} onSubmit={() => { setModalOpen(false); notify('تم حفظ الإجراء محليًا للمعاينة'); }}/>} 
        {selectedItem && <AdminDetailsDrawer config={config} item={selectedItem} onClose={() => setSelectedItem(null)} notify={notify}/>} 
      </>}
    </AdminPageFrame>
  );
}
