import React from 'react';
import Icon from '../../../../../components/Icon/Icon';

function ExpertInviteSection() {
  return (
    <section className="section pro-invite">
      <div className="container pro-invite__inner" data-reveal>
        <div>
          <span className="kicker">للخبراء والمكاتب</span>
          <h2>خبرتك أقوى عندما تستطيع الاستعانة بالخبرة المكملة.</h2>
          <p>شارك في سؤال محدد، قدّم مراجعة مستقلة، أو استعن بمختص مكمل لحالة من مكتبك الحالي مع وضوح المهمة والصلاحية.</p>
          <a className="btn btn--primary" href="#join">انضم كخبير <Icon name="arrow" size={17}/></a>
        </div>
        <div className="pro-visual" aria-hidden="true">
          <div className="pro-center">خبرتك</div>
          <span className="pro-node pro-node--1">مراجعة مستقلة</span>
          <span className="pro-node pro-node--2">مساهمة محددة</span>
          <span className="pro-node pro-node--3">تنسيق حالة</span>
          <svg viewBox="0 0 500 320"><path d="M250 160 105 75M250 160 405 78M250 160 405 250"/></svg>
        </div>
      </div>
    </section>
  );
}

export default ExpertInviteSection;
