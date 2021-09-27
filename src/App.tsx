import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { Dashboard } from './components/dashboard';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
};
