import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';

import Assets from './pages/Assets';
import Alerts from './pages/Alerts';
import Incidents from './pages/Incidents';
import AIChat from './pages/AIChat';
import Logs from './pages/Logs';
import Vulnerabilities from './pages/Vulnerabilities';
import ThreatIntelligence from './pages/ThreatIntelligence';
import Reports from './pages/Reports';
import UEBA from './pages/UEBA';

function App() {
  // TODO: Move mode to Redux or Context
  const [mode] = useState<'light' | 'dark'>('dark');
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/ai" element={<AIChat />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/threat-intel" element={<ThreatIntelligence />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ueba" element={<UEBA />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
