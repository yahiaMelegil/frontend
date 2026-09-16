import React from 'react';
import Icon from '../../../../../components/Icon/Icon';

function FinalCTASection() {
  return (
    <section className="final-cta" id="start">
      <div className="container final-cta__box" data-reveal>
        <div className="final-cta__pattern" aria-hidden="true"><span/><span/><span/><span/></div>
        <span className="eyebrow eyebrow--light"><span className="eyebrow__dot"/> ابدأ من حاجتك</span>
        <h2>لست بحاجة لمعرفة من تحتاج أولًا.</h2>
        <p>ابدأ بشرح حالتك، ودع الخطوة التالية تصبح أوضح.</p>
        <div><a className="btn btn--cream btn--lg" href="#top">ابدأ حالتك الآن <Icon name="arrow" size={18}/></a><a className="ghost-link" href="#how">كيف تعمل المنصة؟</a></div>
      </div>
    </section>
  );
}

export default FinalCTASection;
