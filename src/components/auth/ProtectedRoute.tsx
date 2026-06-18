import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/auth';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import { useAdminAuthStore } from '@/hooks/adminAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'donor' | 'hospital' | 'admin';
}

export const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const location = useLocation();

  const donorAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const donorRole = useAuthStore((s) => s.session?.role);
  const hospitalAuthenticated = useHospitalAuthStore((s) => s.isAuthenticated);
  const adminAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  const isDonor = donorAuthenticated && donorRole === 'donor';
  const isHospital = hospitalAuthenticated;
  const isAdmin = adminAuthenticated;

  if (!isDonor && !isHospital && !isAdmin) {
    // Redirect to the appropriate login page based on the requested route
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRole) return <>{children}</>;
  if (allowedRole === 'donor' && isDonor) return <>{children}</>;
  if (allowedRole === 'hospital' && isHospital) return <>{children}</>;
  if (allowedRole === 'admin' && isAdmin) return <>{children}</>;

  let redirectTo = '/';
  if (isDonor) redirectTo = '/donor/dashboard';
  if (isHospital) redirectTo = '/hospital/dashboard';
  if (isAdmin) redirectTo = '/admin/dashboard';

  return <Navigate to={redirectTo} replace />;
};
