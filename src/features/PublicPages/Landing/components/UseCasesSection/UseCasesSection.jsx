import React from 'react';
import Icon from '../../../../../components/Icon/Icon';
import { useCases } from '../../data/landingData';


function UseCasesSection() {
  return (
    <section className="section cases">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <div><span className="kicker">أمثلة يفهمها الجميع</span><h2>حالات تبدأ من الحياة الحقيقية.</h2></div>
          <p>قد تحتاج خبيرًا واحدًا، وقد تحتاج أكثر من تخصص. عدد الخبراء يتبع حاجة الحالة، وليس قالبًا ثابتًا.</p>
        </div>
        <div className="case-cards">
          {useCases.map((item, i) => (
            <article className="story-card" data-reveal style={{ '--delay': `${i*75}ms` }} key={item.tag}>
              <div className="story-card__top"><span>{String(i+1).padStart(2,'0')}</span><em>{item.tag}</em></div>
              <h3>{item.q}</h3>
              <div className="expert-pills">{item.experts.map(x => <span key={x}><Icon name="user" size={15}/>{x}</span>)}</div>
              <p>{item.out}</p>
              <a href="#start">اكتشف المسار <Icon name="arrow" size={16}/></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCasesSection;
