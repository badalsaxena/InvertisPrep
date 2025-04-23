import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Settings, LogOut } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Manage and monitor website resources and content.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resource Upload Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upload Resources</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                Upload PDF documents for students including notes, previous year questions, and more.
              </p>
              <Button onClick={() => navigate('/admin/upload')} className="w-full">
                Manage Uploads
              </Button>
            </CardContent>
          </Card>
          
          {/* User Management Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                Manage user accounts, roles, and permissions.
              </p>
              <Button variant="outline" onClick={() => navigate('/admin/users')} className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>
          
          {/* Settings Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Admin Settings</CardTitle>
              <Settings className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                Configure website settings and preferences.
              </p>
              <Button variant="outline" onClick={() => navigate('/admin/settings')} className="w-full">
                Manage Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button variant="destructive" onClick={handleLogout} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 