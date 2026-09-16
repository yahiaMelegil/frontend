import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import './Navbar.css';
import { PATHS } from '../../routes/paths';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`topbar ${scrolled ? 'topbar--scrolled' : ''}`}>
      <div className="topbar__inner container">
        <Logo />
        <nav className="nav" aria-label="التنقل الرئيسي">
          <a className="active" href="#top">الرئيسية</a>
          <a href="#how">كيف تعمل</a>
          <a href="#experts">الخبراء</a>
          <a href="#services">الخدمات</a>
          <a href="#about">عن المنصة</a>
        </nav>
       <div className="nav-actions">
  <Link className="btn btn--primary" to={PATHS.ADMIN_LOGIN}>
    دخول الإدارة
  </Link>

  <Link className="btn btn--soft" to={PATHS.LOGIN}>
    تسجيل الدخول
  </Link>

  <Link className="btn btn--peach" to={PATHS.REGISTER}>
    ابدأ الآن
  </Link>
</div>
      </div>
    </header>
  );
}
