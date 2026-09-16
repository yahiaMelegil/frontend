import React from 'react';
import Icon from '../../../../../components/Icon/Icon';
import { experts } from '../../data/landingData';


function ExpertsSection() {
  return (
    <section className="section experts" id="experts">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <div><span className="kicker">الخبرة المناسبة</span><h2>الخبير المناسب، للسؤال المناسب.</h2></div>
          <p>المطابقة تبدأ من تفاصيل الحالة: المجال واللغة والبلد والتوفر، ثم يراجع الخبير الملاءمة قبل بدء الخدمة.</p>
        </div>
        <div className="expert-layout">
          <div className="matching-panel" data-reveal>
            <div className="matching-head"><span><Icon name="spark"/> مطابقة الحالة</span><em>مثال توضيحي</em></div>
            <h3>ما نوع الخبرة التي تحتاجها هذه الحالة؟</h3>
            <div className="match-row"><b>المجال الرئيسي</b><span>قانوني</span></div>
            <div className="match-row"><b>مجال مساند</b><span>تقني</span></div>
            <div className="match-row"><b>اللغة</b><span>العربية</span></div>
            <div className="match-score"><span>ملاءمة السياق</span><div><i style={{ width: '86%' }}/></div><b>عالية</b></div>
          </div>
          <div className="expert-cards">
            {experts.map(([initials, role, specialty, language], i) => (
              <article className="expert-card" data-reveal style={{ '--delay': `${i*65}ms` }} key={role}>
                <div className="expert-avatar">{initials}</div>
                <div className="expert-card__body"><span className="verified"><Icon name="check" size={13}/> تم التحقق</span><h3>{role}</h3><p>{specialty}</p><small>{language}</small></div>
                <button aria-label={`عرض ${role}`}><Icon name="arrow" size={17}/></button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExpertsSection;
