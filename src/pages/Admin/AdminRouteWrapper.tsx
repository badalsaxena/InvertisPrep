import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteWrapperProps {
  children: ReactNode;
}

const AdminRouteWrapper = ({ children }: AdminRouteWrapperProps) => {
  const isAdmin = localStorage.getItem('admin_authenticated') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};

export default AdminRouteWrapper; 