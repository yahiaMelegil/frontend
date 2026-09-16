import React, { useState } from 'react';
import { settingsGroups, settingsTabs } from '../../data/adminPagesData';
import AdminPageFrame from '../../components/AdminPageFrame/AdminPageFrame';
import AdminIcon from '../../components/AdminIcon/AdminIcon';

const initialValues = Object.values(settingsGroups).flat().flatMap((group) => group.fields).reduce((values, field) => ({ ...values, [field.id]: field.value }), {});

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general');
  const [values, setValues] = useState(initialValues);
  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));

  return (
    <AdminPageFrame activePage="settings" eyebrow="تهيئة المنصة" title="الإعدادات" description="ضبط هوية المنصة وسير العمل والأمن والتنبيهات ضمن واجهة قابلة للربط لاحقًا." icon="settings" actions={[]}>
      {({ notify }) => <>
        <div className="admin-page-notice"><span><AdminIcon name="database" size={20}/></span><div><b>وضع المعاينة المحلية</b><p>التغييرات لا تُرسل إلى خادم ولا تؤثر في المشروع؛ يمكن تجربة جميع الحقول بأمان.</p></div></div>
        <div className="admin-settings-layout">
          <nav className="admin-settings-tabs" aria-label="أقسام الإعدادات">{settingsTabs.map((item) => <button className={tab === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => setTab(item.id)}><AdminIcon name={item.icon} size={19}/><span>{item.label}</span><AdminIcon name="chevron" size={15}/></button>)}</nav>
          <div className="admin-settings-content">{settingsGroups[tab].map((group) => <section className="admin-settings-card" key={group.title}><div><h2>{group.title}</h2><p>{group.description}</p></div><div className="admin-settings-fields">{group.fields.map((field) => <div className="admin-setting-field" key={field.id}><label htmlFor={field.id}>{field.label}</label>{field.type === 'toggle' ? <button id={field.id} className={`admin-setting-toggle${values[field.id] ? ' is-on' : ''}`} type="button" role="switch" aria-checked={values[field.id]} onClick={() => update(field.id, !values[field.id])}><span/><b>{values[field.id] ? 'مفعّل' : 'متوقف'}</b></button> : field.type === 'select' ? <select id={field.id} value={values[field.id]} onChange={(event) => update(field.id, event.target.value)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input id={field.id} type={field.type} value={values[field.id]} onChange={(event) => update(field.id, event.target.value)}/>}</div>)}</div></section>)}<div className="admin-settings-actions"><button type="button" onClick={() => setValues(initialValues)}><AdminIcon name="refresh" size={17}/>استعادة القيم</button><button className="is-primary" type="button" onClick={() => notify('تم حفظ الإعدادات محليًا للمعاينة')}><AdminIcon name="save" size={17}/>حفظ التغييرات</button></div></div>
        </div>
      </>}
    </AdminPageFrame>
  );
}
