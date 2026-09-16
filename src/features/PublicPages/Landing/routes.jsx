import React from 'react';
import { Route } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import Landing from './Landing';

export default [
  <Route key="landing" path={PATHS.HOME} element={<Landing />} />,
];
