import React from 'react';
import heroTeamImage from '../../../../assets/images/hero-team.jpg';
import AuthIcon from '../../../auth/components/AuthIcon/AuthIcon';

const content = {
  login: {
    eyebrow: 'بوابة الخبير',
    title: 'ارجع إلى مساحة مهنية تعرف سياق كل حالة.',
    text: 'تابع الطلبات المناسبة، المواد المصرّح بها، التسليمات ومسار العمل من مكان واحد منظم.',
    active: 3,
  },
  register: {
    eyebrow: 'انضم كخبير',
    title: 'هوية واحدة، وخبرة تُراجع قبل أن تُنشر.',
    text: 'أنشئ دورك المهني أولًا، ثم أكمل التحقق من المؤهلات والنطاق والبلد قبل إتاحة خدماتك للعملاء.',
    active: 1,
  },
  forgot: {
    eyebrow: 'استعادة الوصول',
    title: 'استعد وصولك بدون كشف معلومات حسابك.',
    text: 'نستخدم استجابة محايدة ورسالة استعادة محدودة الصلاحية للمحافظة على خصوصية حساب الخبير.',
    active: 2,
  },
  reset: {
    eyebrow: 'تأمين الحساب',
    title: 'كلمة مرور جديدة، ومسار عودة آمن.',
    text: 'أنشئ كلمة مرور قوية للرابط الحالي، ثم عد إلى بوابة الخبير بعد نجاح الاستعادة.',
    active: 2,
  },
  verify: {
    eyebrow: 'تأكيد البريد',
    title: 'خطوة قصيرة قبل بدء ملفك المهني.',
    text: 'تحقق من بريدك حتى نثبت وسيلة التواصل وننتقل بك إلى مسار الانضمام المهني بشكل واضح.',
    active: 1,
  },
  verified: {
    eyebrow: 'تم التحقق',
    title: 'بريدك مؤكد، والخطوة التالية هي ملفك المهني.',
    text: 'تأكيد البريد لا ينشر ملف الخبير. النشر يأتي لاحقًا بعد استكمال التحقق المهني واعتماد النطاق المناسب.',
    active: 2,
  },
};

export default function ExpertAuthShowcase({ mode = 'login' }) {
  const current = content[mode] || content.login;

  return (
    <section className="expert-auth-visual" aria-label="مسار حساب الخبير">
      <div className="expert-auth-visual__mesh" aria-hidden="true">
        <span className="expert-auth-orb expert-auth-orb--1" />
        <span className="expert-auth-orb expert-auth-orb--2" />
        <span className="expert-auth-orb expert-auth-orb--3" />
        <svg className="expert-auth-network" viewBox="0 0 720 760" preserveAspectRatio="none">
          <path d="M70 160C180 74 286 146 366 116S560 65 650 165" />
          <path d="M92 588C215 476 286 530 386 425S535 330 650 398" />
          <path d="M366 116C338 245 438 290 386 425" />
          <circle cx="70" cy="160" r="5"/><circle cx="366" cy="116" r="7"/><circle cx="650" cy="165" r="5"/>
          <circle cx="92" cy="588" r="5"/><circle cx="386" cy="425" r="7"/><circle cx="650" cy="398" r="5"/>
        </svg>
      </div>

      <div className="expert-auth-visual__content">
        <span className="expert-auth-visual__eyebrow"><AuthIcon name="nodes" size={17}/> {current.eyebrow}</span>
        <h2>{current.title}</h2>
        <p>{current.text}</p>

        <div className="expert-auth-photo-card">
          <img src={heroTeamImage} alt="خبراء يعملون ضمن سياق مهني مشترك" />
          <div className="expert-auth-photo-card__shade" />
          <div className="expert-auth-photo-card__caption">
            <span><AuthIcon name="shield" size={15}/> صلاحيات واضحة</span>
            <strong>خبرتك تعمل داخل سياق منظم، لا داخل رسائل متفرقة.</strong>
          </div>
          <div className="expert-auth-floating-note expert-auth-floating-note--top"><span className="expert-auth-live-dot"/> طلب مناسب للنطاق</div>
          <div className="expert-auth-floating-note expert-auth-floating-note--bottom"><AuthIcon name="check" size={15}/> مخرج مهني موثّق</div>
        </div>

        <div className="expert-auth-journey" aria-label="مسار انضمام الخبير">
          {[
            ['01', 'الحساب'],
            ['02', 'التحقق'],
            ['03', 'مساحة الخبير'],
          ].map(([number, label], index) => (
            <React.Fragment key={number}>
              <div className={index + 1 <= current.active ? 'is-active' : ''}>
                <i>{number}</i><span>{label}</span>
              </div>
              {index < 2 && <b aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
