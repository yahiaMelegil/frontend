import React from 'react';

export default function AdminStatusPill({ children, tone = 'neutral' }) {
  return <span className={`admin-status-pill is-${tone}`}><i/>{children}</span>;
}
