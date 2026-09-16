import React from 'react';
import Icon from '../../../../../components/Icon/Icon';
import { contextItems } from '../../data/landingData';


function ContextBentoSection() {
  return (
    <section className="section context-section" id="services">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="kicker">داخل كل حالة</span>
          <h2>كل ما تحتاجه، مترابط في مكان واحد.</h2>
          <p>الحالة تجمع الأسئلة والمستندات والخبراء والجلسات والمخرجات في مساحة واحدة، مع إبراز الإجراء التالي.</p>
        </div>
        <div className="bento">
          <article className="bento-main" data-reveal>
            <div className="case-window">
              <div className="case-window__top"><span>حالة نشطة</span><b>قرار شراء عقار</b><i>آخر تحديث الآن</i></div>
              <div className="timeline-row"><span>1</span><div><b>تقرير المعاينة</b><small>تمت المراجعة بواسطة الخبير الهندسي</small></div><em>مكتمل</em></div>
              <div className="timeline-row"><span>2</span><div><b>مراجعة الالتزامات</b><small>مرتبطة بنتائج المعاينة والمستندات</small></div><em>قيد العمل</em></div>
              <div className="timeline-row muted"><span>3</span><div><b>الخطوة التالية</b><small>تتحدد بعد اعتماد المراجعة الحالية</small></div><em>لاحقًا</em></div>
            </div>
          </article>
          {contextItems.map(([title,text,icon], i) => (
            <article className={`bento-card bento-card--${i+1}`} data-reveal style={{ '--delay': `${i*45}ms` }} key={title}>
              <span><Icon name={icon}/></span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContextBentoSection;
