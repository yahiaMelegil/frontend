import React from 'react';

const statusTone = {
  'قيد المراجعة': 'review',
  'يتطلب إجراء': 'danger',
  'مراقبة': 'warning',
  'بانتظار التعيين': 'neutral',
};

export default function StatusBadge({ children }) {
  return <span className={`admin-status-badge is-${statusTone[children] || 'neutral'}`}><i />{children}</span>;
}
