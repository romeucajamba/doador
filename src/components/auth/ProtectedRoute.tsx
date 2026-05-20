import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/auth';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'donor' | 'hospital';
}

export const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const location = useLocation();

  const donorAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const donorRole = useAuthStore((s) => s.session?.role);
  const hospitalAuthenticated = useHospitalAuthStore((s) => s.isAuthenticated);

  const isDonor = donorAuthenticated && donorRole === 'donor';
  const isHospital = hospitalAuthenticated;

  // 1. Ninguém autenticado → login (nunca faz redirect para rota protegida)
  if (!isDonor && !isHospital) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Role certa → passa
  if (!allowedRole) return <>{children}</>;
  if (allowedRole === 'donor' && isDonor) return <>{children}</>;
  if (allowedRole === 'hospital' && isHospital) return <>{children}</>;

  // 3. Role errada → redireciona para a dashboard do utilizador actual
  //    (nunca para uma rota protegida do role errado)
  const redirectTo = isDonor ? '/donor/dashboard' : '/hospital/dashboard';
  return <Navigate to={redirectTo} replace />;
};
