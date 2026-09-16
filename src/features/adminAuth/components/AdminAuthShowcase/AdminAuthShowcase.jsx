import React from 'react';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';

const adminAreas = [
  ['الخبراء', 'تحقق وصلاحيات'],
  ['الحالات', 'إشراف منضبط'],
  ['السجل', 'أثر قابل للتدقيق'],
];

export default function AdminAuthShowcase() {
  return (
    <section className="admin-auth-visual" aria-label="منطقة الإدارة الآمنة">
      <div className="admin-auth-visual__mesh" aria-hidden="true">
        <span className="admin-auth-orb admin-auth-orb--1" />
        <span className="admin-auth-orb admin-auth-orb--2" />
        <span className="admin-auth-orb admin-auth-orb--3" />
        <span className="admin-auth-grid" />
        <svg className="admin-auth-network" viewBox="0 0 720 760" preserveAspectRatio="none">
          <path d="M64 152C182 92 248 146 355 112S558 70 658 164" />
          <path d="M82 590C196 508 290 548 372 438S538 326 652 394" />
          <path d="M355 112C336 246 434 296 372 438" />
          <circle cx="64" cy="152" r="5"/><circle cx="355" cy="112" r="7"/><circle cx="658" cy="164" r="5"/>
          <circle cx="82" cy="590" r="5"/><circle cx="372" cy="438" r="7"/><circle cx="652" cy="394" r="5"/>
        </svg>
      </div>

      <div className="admin-auth-visual__content">
        <span className="admin-auth-visual__eyebrow"><AuthIcon name="shield" size={16}/> إدارة آمنة ومحددة الصلاحيات</span>
        <h2>تحكّم واضح بالمنصة، مع وصول إداري لا يتجاوز المهمة.</h2>
        <p>مساحة مخصصة للإشراف على الخبراء والحالات وجودة التشغيل، مع إبراز الصلاحيات وسجل الإجراءات الإدارية.</p>

        <div className="admin-auth-console" aria-hidden="true">
          <div className="admin-auth-console__topbar">
            <div><span className="admin-auth-live-dot" /><b>مركز التحكم</b></div>
            <span>ADMIN</span>
          </div>

          <div className="admin-auth-console__body">
            <div className="admin-auth-control-map">
              <span className="admin-auth-control-map__ring admin-auth-control-map__ring--one" />
              <span className="admin-auth-control-map__ring admin-auth-control-map__ring--two" />
              <div className="admin-auth-control-map__center"><AuthIcon name="shield" size={31}/><strong>إدارة</strong></div>
              <span className="admin-auth-control-node admin-auth-control-node--1"><i />خبراء</span>
              <span className="admin-auth-control-node admin-auth-control-node--2"><i />حالات</span>
              <span className="admin-auth-control-node admin-auth-control-node--3"><i />سياسات</span>
            </div>

            <div className="admin-auth-console__side">
              <div className="admin-auth-access-card">
                <span><AuthIcon name="lock" size={16}/></span>
                <div><b>وصول حسب الصلاحية</b><small>Least-privilege access</small></div>
              </div>
              <div className="admin-auth-audit-card">
                <div className="admin-auth-audit-card__head"><span><AuthIcon name="nodes" size={15}/> سجل الإدارة</span><i /></div>
                <p><span />تغيير موثق</p>
                <p><span />مراجعة صلاحية</p>
                <p><span />إجراء قابل للتتبع</p>
              </div>
            </div>
          </div>

          <div className="admin-auth-console__footer">
            {adminAreas.map(([title, text]) => (
              <div key={title}><AuthIcon name="check" size={13}/><span><b>{title}</b><small>{text}</small></span></div>
            ))}
          </div>
        </div>

        <div className="admin-auth-visual__trust">
          <span><AuthIcon name="shield" size={14}/> منطقة إدارية محمية</span>
          <span><AuthIcon name="check" size={14}/> الإجراءات الحساسة قابلة للتدقيق</span>
        </div>
      </div>
    </section>
  );
}
