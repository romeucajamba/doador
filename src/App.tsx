import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DonorLayout } from './components/layouts/DonorLayout';
import { HospitalLayout } from './components/layouts/HospitalLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DonorDashboard } from './pages/donor/Dashboard';
import { HospitalList } from './pages/donor/HospitalList';
import { Appointments } from './pages/donor/Appointments';
import { HospitalDashboard } from './pages/hospital/Dashboard';
import { StockManagement } from './pages/hospital/StockManagement';
import { DonorManagement } from './pages/hospital/DonorManagement';
import { Profile } from './pages/donor/Profile';
import { useState } from 'react';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="centers" element={<HospitalList />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Hospital Routes */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRole="hospital">
                <HospitalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HospitalDashboard />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="donors" element={<DonorManagement />} />
            <Route path="messages" element={<ComingSoon title="Messages" />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const ComingSoon = ({ title }: { title: string }) => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
    <div className="size-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
      <span className="text-4xl">🏗️</span>
    </div>
    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
      {title}
    </h2>
    <p className="text-slate-500 font-medium max-w-xs">
      This section is currently under construction and will be available soon.
    </p>
  </div>
);

export default App;
