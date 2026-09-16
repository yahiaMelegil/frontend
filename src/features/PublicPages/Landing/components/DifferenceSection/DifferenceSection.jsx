import React from 'react';

function DifferenceSection() {
  return (
    <section className="section difference" id="about">
      <div className="container">
        <div className="statement" data-reveal>
          <span className="kicker">الفرق الحقيقي</span>
          <h2>مشكلتك ليست مجموعة محادثات منفصلة.</h2>
          <p>بدل أن تجمع النصائح بنفسك، تبقى الأسئلة والمستندات ومساهمات المختصين داخل سياق واحد يوضح ما الذي بُني عليه كل رأي.</p>
        </div>
        <div className="compare-grid">
          <article className="compare-card compare-card--before" data-reveal>
            <span className="compare-label">بدون سياق موحد</span>
            <div className="scatter-ui">
              <div className="mini-chat mini-chat--1">رأي قانوني <span>منفصل</span></div>
              <div className="mini-chat mini-chat--2">ملف PDF <span>نسخة مختلفة</span></div>
              <div className="mini-chat mini-chat--3">ملاحظة مالية <span>غير مرتبطة</span></div>
              <div className="scribble"/>
            </div>
            <h3>آراء كثيرة، وربطها عليك.</h3>
          </article>
          <article className="compare-card compare-card--after" data-reveal style={{ '--delay': '100ms' }}>
            <span className="compare-label">مع الحالة</span>
            <div className="unified-ui">
              <div className="unified-center">الحالة<small>سياق واحد</small></div>
              <span className="u-node u-node--1">قانوني</span><span className="u-node u-node--2">تقني</span><span className="u-node u-node--3">مالي</span><span className="u-node u-node--4">قرار موحّد</span>
              <svg viewBox="0 0 500 240" aria-hidden="true"><path d="M250 120 120 58M250 120 385 58M250 120 120 192M250 120 382 192"/></svg>
            </div>
            <h3>سياق واحد. قرار أوضح.</h3>
          </article>
        </div>
      </div>
    </section>
  );
}

export default DifferenceSection;
