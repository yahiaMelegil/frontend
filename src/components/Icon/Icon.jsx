import React from 'react';

const Icon = ({ name, size = 22 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    arrow: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
    case: <><rect x="3.5" y="4" width="17" height="16" rx="4"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    nodes: <><circle cx="12" cy="12" r="2.5"/><circle cx="4.5" cy="6" r="2"/><circle cx="19.5" cy="6" r="2"/><circle cx="4.5" cy="18" r="2"/><circle cx="19.5" cy="18" r="2"/><path d="m10 10-4-3M14 10l4-3M10 14l-4 3M14 14l4 3"/></>,
    spark: <><path d="m12 3 1.1 3.2L16 7.5l-2.9 1.3L12 12l-1.1-3.2L8 7.5l2.9-1.3L12 3Z"/><path d="m18 14 .8 2.1 2.2.9-2.2.9L18 20l-.8-2.1L15 17l2.2-.9L18 14Z"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.7 8.1 7 10 4.3-1.9 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    file: <><path d="M7 3.5h7l3 3V20H7z"/><path d="M14 3.5V7h3M9 11h6M9 15h6"/></>,
    check: <path d="m5 12 4 4 10-10"/>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.spark}</svg>;
};

export default Icon;
