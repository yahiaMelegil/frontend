import React from 'react';
import { Link } from 'react-router-dom';
import solveItLogo from '../../../../assets/images/solveit-logo.png';
import solveItSymbol from '../../../../assets/images/solveit-symbol.png';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import { expertSidebarGroups, isExpertVerified } from '../../data/expertDashboardData';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';
import { PATHS } from '../../../../routes/paths';

export default function ExpertSidebar({
  activePage,
  collapsed,
  mobileOpen,
  verificationStatus,
  onToggleSidebar,
  onExpandSidebar,
  onCloseMobile,
}) {
  const { t } = useExpertI18n();
  const verified = isExpertVerified(verificationStatus);

  const handleCollapsedClick = (event) => {
    if (!collapsed || mobileOpen || event.target.closest('a, button, input, select, textarea')) return;
    onExpandSidebar();
  };

  const renderItem = (item) => {
    const label = t(item.labelKey);
    const locked = Boolean(item.requiresVerification && !verified);
    const tooltip = locked ? `${label} — ${t('sidebar.lockedTooltip')}` : label;

    if (locked) {
      return (
        <button
          className="admin-nav-item expert-nav-item--locked"
          type="button"
          key={item.id}
          disabled
          aria-disabled="true"
          title={collapsed ? tooltip : t('sidebar.lockedTooltip')}
          data-tooltip={collapsed ? tooltip : undefined}
        >
          <span className="admin-nav-item__icon"><AdminIcon name={item.icon} size={18} /></span>
          <span className="admin-nav-item__label">{label}</span>
          <span className="expert-nav-item__lock" aria-hidden="true"><AdminIcon name="lock" size={14} /></span>
        </button>
      );
    }

    return (
      <Link
        className={`admin-nav-item${activePage === item.id ? ' is-active' : ''}`}
        to={item.path}
        key={item.id}
        title={collapsed ? label : undefined}
        data-tooltip={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        aria-current={activePage === item.id ? 'page' : undefined}
        onClick={onCloseMobile}
      >
        <span className="admin-nav-item__icon"><AdminIcon name={item.icon} size={18} /></span>
        <span className="admin-nav-item__label">{label}</span>
      </Link>
    );
  };

  return (
    <>
      <button
        className={`admin-drawer-backdrop${mobileOpen ? ' is-visible' : ''}`}
        type="button"
        aria-label={t('sidebar.backdropClose')}
        onClick={onCloseMobile}
      />
      <aside
        id="expert-sidebar"
        className={`admin-sidebar${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-mobile-open' : ''}`}
        aria-label={t('sidebar.navigation')}
        onClick={handleCollapsedClick}
      >
        <div className="admin-sidebar__header">
          <Link className="admin-sidebar__brand" to={PATHS.HOME} aria-label={t('sidebar.brandHome')}>
            <span className="admin-sidebar__logo"><img className="admin-sidebar__logo-full" src={solveItLogo} alt="SolveIt" /><img className="admin-sidebar__logo-symbol" src={solveItSymbol} alt="" /></span>
          </Link>
          {(!collapsed || mobileOpen) && (
            <button
              className="admin-sidebar__toggle"
              type="button"
              aria-label={t(mobileOpen ? 'sidebar.drawerClose' : 'sidebar.close')}
              aria-controls="expert-sidebar"
              aria-expanded="true"
              onClick={onToggleSidebar}
            >
              <AdminIcon className="admin-sidebar__collapse-icon" name="sidebarClose" size={20} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar__nav">
          {expertSidebarGroups.map((group) => (
            <div className="admin-nav-group" key={group.labelKey}>
              <p className="admin-nav-group__label">{t(group.labelKey)}</p>
              <div className="admin-nav-group__items">{group.items.map(renderItem)}</div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-security-note">
            <span><AdminIcon name="shield" size={17} /></span>
            <div><b>{t('sidebar.securityTitle')}</b><small>{t('sidebar.securityDescription')}</small></div>
          </div>
        </div>
      </aside>
    </>
  );
}
