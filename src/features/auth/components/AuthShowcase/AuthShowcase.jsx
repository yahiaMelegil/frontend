import React from 'react';
import heroTeamImage from '../../../../assets/images/hero-team.jpg';
import AuthIcon from '../AuthIcon/AuthIcon';

const showcaseContent = {
  login: {
    title: 'مرحبًا بعودتك إلى مساحة قرار أوضح.',
    description: 'تابع حالاتك ورسائلك ومراجعات الخبراء من مكان واحد، بصلاحيات واضحة وآمنة.',
  },
  register: {
    title: 'ابدأ بسياق واحد، واترك التفاصيل تبقى منظّمة.',
    description: 'أنشئ حسابك مرة واحدة، ثم أنشئ حالاتك وشارك ما يلزم فقط مع الخبير المناسب.',
  },
  forgot: {
    title: 'استعد وصولك إلى حسابك بخطوات واضحة وآمنة.',
    description: 'سنساعدك على طلب رابط استعادة دون كشف معلومات الحساب، مع إبقاء تجربتك بسيطة ومطمئنة.',
  },
  reset: {
    title: 'كلمة مرور جديدة تعيدك إلى مساحة عملك بأمان.',
    description: 'اختر كلمة مرور قوية، ثم ارجع إلى حالاتك واستشاراتك من المكان نفسه.',
  },
  verify: {
    title: 'خطوة واحدة لتأكيد بريدك وإكمال تفعيل الحساب.',
    description: 'تحقق من وسيلة التواصل حتى يبقى حسابك موثوقًا ويمكنك استلام التنبيهات والروابط المهمة بأمان.',
  },
  verified: {
    title: 'تم التأكيد، ومساحتك أصبحت جاهزة للمتابعة.',
    description: 'يمكنك الآن تسجيل الدخول والعودة إلى حالاتك أو بدء حالة جديدة عندما تحتاج إلى خبرة مناسبة.',
  },
};

export default function AuthShowcase({ mode }) {
  const content = showcaseContent[mode] || showcaseContent.login;
  return (
    <section className="auth-visual" aria-label="نبذة عن منصة SolveIt">
      <div className="auth-visual__mesh" aria-hidden="true">
        <span className="auth-orb auth-orb--1" />
        <span className="auth-orb auth-orb--2" />
        <span className="auth-orb auth-orb--3" />
        <svg className="auth-network" viewBox="0 0 700 700" preserveAspectRatio="none">
          <path d="M80 130C190 70 280 160 355 125S535 82 625 165" />
          <path d="M90 515C200 430 284 465 365 390S505 300 620 355" />
          <path d="M355 125C333 235 405 275 365 390" />
          <circle cx="80" cy="130" r="5"/><circle cx="355" cy="125" r="6"/><circle cx="625" cy="165" r="5"/>
          <circle cx="90" cy="515" r="5"/><circle cx="365" cy="390" r="6"/><circle cx="620" cy="355" r="5"/>
        </svg>
      </div>

      <div className="auth-visual__content">
        <span className="auth-visual__eyebrow"><AuthIcon name="nodes" size={17}/> منصة تجمع الخبرة حول حالتك</span>
        <h2>{content.title}</h2>
        <p>{content.description}</p>

        <div className="auth-photo-card">
          <img src={heroTeamImage} alt="مختصون يعملون معًا على حالة مشتركة" />
          <div className="auth-photo-card__shade" />
          <div className="auth-photo-card__flow" aria-hidden="true">
            <span><i>1</i> حالتك</span>
            <b>→</b>
            <span><i>2</i> السياق</span>
            <b>→</b>
            <span><i>3</i> الخبير</span>
          </div>
          <div className="auth-floating-note auth-floating-note--top"><span className="auth-live-dot"/> السياق محفوظ وآمن</div>
          <div className="auth-floating-note auth-floating-note--bottom"><AuthIcon name="check" size={15}/> خطوة تالية واضحة</div>
        </div>

        <div className="auth-visual__trust">
          <span><AuthIcon name="shield" size={16}/> مشاركة بصلاحيات محددة</span>
          <span><AuthIcon name="nodes" size={16}/> خبير واحد أو فريق عند الحاجة</span>
        </div>
      </div>
    </section>
  );
}
