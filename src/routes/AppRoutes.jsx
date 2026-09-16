import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../features/PublicPages/NotFound/NotFound';

const routeModules = import.meta.glob('../features/**/routes.jsx', {
  eager: true,
  import: 'default',
});

const featureRoutes = Object.entries(routeModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .flatMap(([, routes]) => (Array.isArray(routes) ? routes : [routes]));

export default function AppRoutes() {
  return (
    <Routes>
      {featureRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
