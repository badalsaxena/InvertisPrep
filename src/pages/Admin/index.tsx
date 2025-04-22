import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

// Admin page components
import UserManagement from './UserManagement';
import AdminStatistics from './AdminStatistics';
import AdminSettings from './AdminSettings';

const AdminPage: React.FC = () => {
  const { user, authChecking } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user) {
          if (!authChecking) {
            router.push('/login?redirect=/admin');
          }
          return;
        }

        // Get the ID token with admin claim
        const idTokenResult = await user.getIdTokenResult();
        const hasAdminClaim = !!idTokenResult.claims.admin;
        
        if (!hasAdminClaim) {
          console.error("User doesn't have admin permissions");
          router.push('/');
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authChecking, router]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (authChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>View platform usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminStatistics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Manage platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage; 