import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import solveItLogo from '../../../../assets/images/solveit-logo.png';
import solveItSymbol from '../../../../assets/images/solveit-symbol.png';
import { sidebarGroups } from '../../data/adminDashboardData';
import { useAdminI18n } from '../../i18n/AdminI18nContext';
import AdminIcon from '../AdminIcon/AdminIcon';
import { PATHS } from '../../../../routes/paths';

const PRIMARY_ITEM_IDS = new Set(['overview', 'cases', 'experts', 'kyc', 'users', 'complaints', 'risk']);

export default function AdminSidebar({
  activePage,
  collapsed,
  mobileOpen,
  onToggleSidebar,
  onExpandSidebar,
  onCloseMobile,
}) {
  const { t } = useAdminI18n();

  const primaryGroups = useMemo(
    () => sidebarGroups
      .map((group) => ({ ...group, items: group.items.filter((item) => PRIMARY_ITEM_IDS.has(item.id)) }))
      .filter((group) => group.items.length),
    [],
  );

  const moreGroups = useMemo(
    () => sidebarGroups
      .map((group) => ({ ...group, items: group.items.filter((item) => !PRIMARY_ITEM_IDS.has(item.id)) }))
      .filter((group) => group.items.length),
    [],
  );

  const moreItemIds = useMemo(
    () => new Set(moreGroups.flatMap((group) => group.items.map((item) => item.id))),
    [moreGroups],
  );

  const [moreOpen, setMoreOpen] = useState(() => moreItemIds.has(activePage));

  useEffect(() => {
    if (moreItemIds.has(activePage)) setMoreOpen(true);
  }, [activePage, moreItemIds]);

  const handleCollapsedClick = (event) => {
    if (!collapsed || mobileOpen || event.target.closest('a, button, input, select, textarea')) return;
    onExpandSidebar();
  };

  const handleMoreToggle = () => {
    if (collapsed && !mobileOpen) {
      onExpandSidebar();
      setMoreOpen(true);
      return;
    }
    setMoreOpen((value) => !value);
  };

  const renderNavItem = (item) => {
    const label = t(item.labelKey);

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
        {item.badge && <span className={`admin-nav-item__badge is-${item.tone || 'default'}`}>{item.badge}</span>}
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
        id="admin-sidebar"
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
              aria-controls="admin-sidebar"
              aria-expanded="true"
              onClick={onToggleSidebar}
            >
              <AdminIcon className="admin-sidebar__collapse-icon" name="sidebarClose" size={20} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar__nav">
          {primaryGroups.map((group) => (
            <div className="admin-nav-group" key={group.labelKey}>
              <p className="admin-nav-group__label">{t(group.labelKey)}</p>
              <div className="admin-nav-group__items">{group.items.map(renderNavItem)}</div>
            </div>
          ))}

          <div className="admin-nav-more">
            <button
              className={`admin-nav-item admin-more-button${moreOpen ? ' is-open' : ''}${moreItemIds.has(activePage) ? ' is-context-active' : ''}`}
              type="button"
              title={collapsed ? t('sidebar.more') : undefined}
              aria-label={t('sidebar.moreAria')}
              aria-expanded={moreOpen}
              aria-controls="admin-sidebar-more"
              onClick={handleMoreToggle}
            >
              <span className="admin-nav-item__icon"><AdminIcon name="more" size={18} /></span>
              <span className="admin-nav-item__label">{t('sidebar.more')}</span>
              <AdminIcon className="admin-more-button__chevron" name="chevron" size={15} />
            </button>

            <div id="admin-sidebar-more" className={`admin-sidebar__more-panel${moreOpen ? ' is-open' : ''}`}>
              <div className="admin-sidebar__more-inner">
                {moreGroups.map((group) => (
                  <div className="admin-nav-group admin-nav-group--more" key={group.labelKey}>
                    <p className="admin-nav-group__label">{t(group.labelKey)}</p>
                    <div className="admin-nav-group__items">{group.items.map(renderNavItem)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
