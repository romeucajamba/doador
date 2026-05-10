import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'donor' | 'hospital';
}

export const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, session } = useAuthStore();
  const location = useLocation();

  const userRole = session?.role; // garante consistência

  // 1. Não autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Role errada → redireciona para dashboard correto
  if (allowedRole && userRole !== allowedRole) {
    return (
      <Navigate
        to={userRole === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'}
        replace
      />
    );
  }

  // 3. OK → renderiza rota
  return <>{children}</>;
};
