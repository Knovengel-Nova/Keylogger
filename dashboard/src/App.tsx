import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/layout/RequireAuth';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { FleetOverviewPage } from './pages/FleetOverviewPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { DeviceHealthPage } from './pages/DeviceHealthPage';
import { SettingsPage } from './pages/SettingsPage';

const appQueryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={appQueryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<FleetOverviewPage />} />
                <Route path="/users/:userId" element={<UserDetailPage />} />
                <Route path="/devices" element={<DeviceHealthPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
