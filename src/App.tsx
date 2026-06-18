import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DonorLayout } from './components/layouts/DonorLayout';
import { HospitalLayout } from './components/layouts/HospitalLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminRegister } from './pages/auth/AdminRegister';

import { DonorDashboard } from './pages/donor/Dashboard';
import { HospitalList } from './pages/donor/HospitalList';
import { Appointments } from './pages/donor/Appointments';
import { Profile } from './pages/donor/Profile';

import { HospitalDashboard } from './pages/hospital/Dashboard';
import { StockManagement as HospitalStockManagement } from './pages/hospital/StockManagement';
import { DonorManagement as HospitalDonorManagement } from './pages/hospital/DonorManagement';
import { HospitalProfile } from '@/pages/hospital/HospitalProfile';
import { HospitalMessenger } from '@/pages/hospital/Message';

import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { GeographyManagement } from './pages/admin/GeographyManagement';
import { HospitalManagement } from './pages/admin/HospitalManagement';
import { DonorManagement as AdminDonorManagement } from './pages/admin/DonorManagement';
import { StockManagement as AdminStockManagement } from './pages/admin/StockManagement';
import { PedidoManagement } from './pages/admin/PedidoManagement';
import { AgendaManagement } from './pages/admin/AgendaManagement';
import { ComunicacaoManagement } from './pages/admin/ComunicacaoManagement';
import { GamificacaoManagement } from './pages/admin/GamificacaoManagement';
import { AuditoriaManagement } from './pages/admin/AuditoriaManagement';
import { AdminProfile } from './pages/admin/AdminProfile';

import { useState } from 'react';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

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
            <Route path="stock" element={<HospitalStockManagement />} />
            <Route path="donors" element={<HospitalDonorManagement />} />
            <Route path="messages" element={<HospitalMessenger />} />
            <Route path="profile" element={<HospitalProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="geografia" element={<GeographyManagement />} />
            <Route path="hospitais" element={<HospitalManagement />} />
            <Route path="doadores" element={<AdminDonorManagement />} />
            <Route path="stock" element={<AdminStockManagement />} />
            <Route path="pedidos" element={<PedidoManagement />} />
            <Route path="agenda" element={<AgendaManagement />} />
            <Route path="comunicacao" element={<ComunicacaoManagement />} />
            <Route path="gamificacao" element={<GamificacaoManagement />} />
            <Route path="auditoria" element={<AuditoriaManagement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
