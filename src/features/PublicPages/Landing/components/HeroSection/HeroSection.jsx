import React from 'react';
import Icon from '../../../../../components/Icon/Icon';
import BackgroundNetwork from '../BackgroundNetwork/BackgroundNetwork';
import heroTeamImage from '../../assets/hero-team.png';

function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero__atmosphere" aria-hidden="true">
        <span className="orb orb--1"/><span className="orb orb--2"/><span className="orb orb--3"/><span className="orb orb--4"/>
        <BackgroundNetwork />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy" data-reveal>
          <div className="eyebrow"><span className="eyebrow__dot"/> منصة خبراء وسياق موحّد</div>
          <h1 className="hero-title">
            <span className="hero-title-line">من تعقيد الحالة</span>
            <span className="hero-title-line hero-title-line--second">إلى <span className="shine-text">وضوح القرار</span></span>
          </h1>
          <p>اشرح حالتك مرة واحدة، ودع المنصة تنظّم التفاصيل وتوصلك بالخبرات المناسبة ضمن سياق واحد واضح.</p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href="#start">ابدأ حالتك <Icon name="arrow" size={18}/></a>
            <a className="text-link" href="#how">شاهد كيف تعمل <span>↙</span></a>
          </div>
          <div className="hero__microproof">
            <span><Icon name="shield" size={18}/> وصول بصلاحيات واضحة</span>
            <span><Icon name="nodes" size={18}/> خبير واحد أو أكثر حسب الحاجة</span>
          </div>
        </div>

        <div className="hero__visual" data-reveal style={{ '--delay': '120ms' }}>
          <div className="hero-photo-wrap">
            <img src={heroTeamImage} className="hero-photo" alt="فريق من المختصين يناقش حالة مشتركة" />
            <div className="photo-tint" />
            <div className="float-chip float-chip--a"><span className="pulse-dot"/> السياق محدث الآن</div>
            <div className="float-chip float-chip--b"><Icon name="nodes" size={17}/> خبرات متكاملة</div>
            <div className="float-chip float-chip--c"><Icon name="check" size={17}/> خطوة تالية واضحة</div>
          </div>
          <div className="visual-badge visual-badge--one">01 <span>وصف الحالة</span></div>
          <div className="visual-badge visual-badge--two">02 <span>فهم السياق</span></div>
          <div className="visual-badge visual-badge--three">03 <span>مطابقة الخبرة</span></div>
        </div>
      </div>

      <div className="container journey-strip" data-reveal style={{ '--delay': '220ms' }}>
        <article><span className="step-icon"><Icon name="case"/></span><div><b>صف حالتك</b><small>اشرح مشكلتك وأرفق أهم التفاصيل.</small></div></article>
        <article><span className="step-icon"><Icon name="nodes"/></span><div><b>نحدد الخبرة المناسبة</b><small>نوجّه حالتك للتخصص الأنسب لها.</small></div></article>
        <article><span className="step-icon"><Icon name="spark"/></span><div><b>ابدأ الاستشارة</b><small>تواصل مع الخبير وابدأ الحل بخطوات واضحة.</small></div></article>
      </div>
    </section>
  );
}

export default HeroSection;
