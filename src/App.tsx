import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuthStore } from './store/useAuthStore';

import { AIChatWindow } from './features/ai-engine/components/AIChatWindow';
import { MemoryDashboard } from './features/memory/components/MemoryDashboard';
import { AutomationDashboard } from './features/automation/components/AutomationDashboard';
import { CreatorStudioDashboard } from './features/creator-studio/components/CreatorStudioDashboard';
import { TelemetryDashboard } from './features/telemetry/components/TelemetryDashboard';
import { SecurityPage } from './pages/security/SecurityPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<OverviewPage />} />
              {/* Fallback redirect for phase routes to dashboard */}
              <Route path="studio" element={<AIChatWindow />} />
              <Route path="workspace" element={<CreatorStudioDashboard />} />
              <Route path="workflows" element={<AutomationDashboard />} />
              <Route path="knowledge" element={<MemoryDashboard />} />
              <Route path="integrations" element={<AutomationDashboard />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="analytics" element={<TelemetryDashboard />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
