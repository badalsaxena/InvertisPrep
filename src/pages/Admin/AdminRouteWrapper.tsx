import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminRouteWrapperProps {
  children: ReactNode;
}

const AdminRouteWrapper = ({ children }: AdminRouteWrapperProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('AdminRouteWrapper mounted');
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    console.log('Is admin authenticated in wrapper?', isAdmin);
    setIsAuthenticated(isAdmin);
    setLoading(false);
    
    if (!isAdmin) {
      console.log('Not authenticated, redirecting to /admin');
      navigate('/admin');
    } else {
      console.log('Admin is authenticated, rendering children');
    }
  }, [navigate]);
  
  if (loading) {
    console.log('AdminRouteWrapper: Still loading...');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('AdminRouteWrapper: Not authenticated, returning null');
    return null; // Navigation is handled in useEffect
  }
  
  console.log('AdminRouteWrapper: Rendering children');
  return <>{children}</>;
};

export default AdminRouteWrapper; 