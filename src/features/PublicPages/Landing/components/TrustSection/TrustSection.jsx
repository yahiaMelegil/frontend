import React from 'react';
import Icon from '../../../../../components/Icon/Icon';

function TrustSection() {
  return (
    <section className="section trust">
      <div className="container trust__grid">
        <div className="trust__copy" data-reveal>
          <span className="kicker kicker--light">الثقة والخصوصية</span>
          <h2>سياق مشترك، وليس وصولًا مفتوحًا.</h2>
          <p>الانضمام إلى الحالة لا يعني فتح كل معلوماتك. المشاركة تكون محددة لكل خبير وفق المهمة والغرض والصلاحية.</p>
          <div className="trust-points">
            <span><Icon name="shield"/> مشاركة محددة</span>
            <span><Icon name="file"/> مصدر ونسخة واضحة</span>
            <span><Icon name="lock"/> صلاحيات قابلة للمراجعة</span>
          </div>
        </div>
        <div className="permission-flow" data-reveal style={{ '--delay': '100ms' }}>
          <div className="permission-doc"><Icon name="file" size={30}/><b>تقرير المعاينة.pdf</b><small>مستند من الحالة</small></div>
          <div className="permission-line"><span/><em>السماح بالمشاركة</em><span/></div>
          <div className="permission-control"><Icon name="lock" size={20}/><div><b>صلاحية محددة</b><small>عرض فقط • لهذه المهمة</small></div><i>مفعّلة</i></div>
          <div className="permission-line"><span/><em>يصل فقط للمصرّح له</em><span/></div>
          <div className="permission-expert"><div className="avatar">خ</div><div><b>الخبير المختص</b><small>مهمة: مراجعة نقطة محددة</small></div><Icon name="check"/></div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
