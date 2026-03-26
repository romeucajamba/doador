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
import { HospitalProfile } from '@/pages/hospital/DonorProfile';
import { HospitalMessenger } from '@/pages/hospital/Message';

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
            <Route path="messages" element={<HospitalMessenger />} />
            <Route path="perfil-hospital" element={<HospitalProfile />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
