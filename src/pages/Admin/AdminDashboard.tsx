import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  FilePdf,
  Users,
  LogOut,
  Menu,
  X,
  FolderTree
} from 'lucide-react';
import PDFUpload from './PDFUpload';
import AdminOverview from './AdminOverview';
import DepartmentManager from './DepartmentManager';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if authenticated on mount
  useEffect(() => {
    console.log('AdminDashboard component mounted');
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      console.log('Is admin authenticated in dashboard?', isAuthenticated);
      setIsAdmin(isAuthenticated);
      setLoading(false);
      
      if (!isAuthenticated) {
        console.log('Not authenticated in dashboard, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('Admin is authenticated in dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Logging out admin');
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    console.log('AdminDashboard: Still loading...');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('AdminDashboard: Not authenticated, returning null');
    return null; // Will redirect via useEffect
  }

  console.log('AdminDashboard: Rendering dashboard UI');
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 bg-white border-r shadow-sm`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary mb-1">InvertisPrep</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <p className="text-sm font-medium mb-1">admin</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        
        <Separator />
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard/upload" 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FilePdf size={18} />
                <span>Upload Resources</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard/departments" 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FolderTree size={18} />
                <span>Manage Departments</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard/users" 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300 ease-in-out`}>
        <main className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="upload" element={<PDFUpload />} />
            <Route path="departments" element={<DepartmentManager />} />
            <Route path="users" element={<div>User Management (Coming Soon)</div>} />
            <Route path="*" element={<AdminOverview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 