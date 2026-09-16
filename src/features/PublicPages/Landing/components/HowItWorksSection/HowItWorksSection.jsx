import React from 'react';
import Icon from '../../../../../components/Icon/Icon';
import { landingSteps } from '../../data/landingData';


function HowItWorksSection() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head how__head" data-reveal>
          <span className="kicker">كيف تعمل المنصة؟</span>
          <h2>من وصف بسيط… إلى قرار أوضح.</h2>
          <p>لا تحتاج أن تعرف من هو الخبير المناسب قبل أن تبدأ. تبدأ الرحلة من حاجتك، ثم تتحول الحالة إلى مسار منظم يمكن مراجعته.</p>
        </div>

        <div className="how-grid">
          <div className="case-orbit" data-reveal>
            <div className="orbit-ring orbit-ring--one"/><div className="orbit-ring orbit-ring--two"/>
            <div className="case-core"><small>السياق الموحّد</small><strong>الحالة</strong><span>كل شيء يبدأ من هنا</span></div>
            <div className="orbit-pill orbit-pill--1"><Icon name="file"/> مستندات</div>
            <div className="orbit-pill orbit-pill--2"><Icon name="user"/> خبير مناسب</div>
            <div className="orbit-pill orbit-pill--3"><Icon name="check"/> توصية</div>
            <div className="orbit-pill orbit-pill--4"><Icon name="clock"/> خط زمني</div>
          </div>
          <div className="steps-stack">
            {landingSteps.map(([no,title,text,icon], i) => (
              <article className="step-card" data-reveal style={{ '--delay': `${i * 70}ms` }} key={no}>
                <span className="step-card__no">{no}</span>
                <span className="step-card__icon"><Icon name={icon}/></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
