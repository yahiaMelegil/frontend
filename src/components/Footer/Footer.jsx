import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import './Footer.css';
import { PATHS } from '../../routes/paths';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand"><Logo/><p>منصة تجمع المشكلة والخبرات والمعلومات ضمن حالة واحدة وسياق واضح.</p><b>مشكلة واحدة. خبرات تعمل معًا.</b></div>
        <div><h4>المنصة</h4><a href="#how">كيف تعمل</a><a href="#services">الخدمات</a><a href="#experts">الخبراء</a></div>
        <div><h4>المزيد</h4><a href="#about">عن المنصة</a><a href="#join">انضم كخبير</a><a href="#privacy">الخصوصية</a></div>
        <div><h4>تواصل</h4><a href="mailto:hello@example.com">تواصل معنا</a><a href="#terms">الشروط</a><Link to={PATHS.LOGIN}>تسجيل الدخول</Link></div>
      </div>
      <div className="container footer__bottom"><span>© 2026 SolveIt</span><span>تصميم RTL متجاوب</span></div>
    </footer>
  );
}
