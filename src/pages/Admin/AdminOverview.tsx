import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePdf, Users, Clock, FileUp } from 'lucide-react';

const BACKEND_URL = "https://invertisprepbackend.onrender.com";

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalDocuments: '—',
    totalUsers: '—',
    recentUploads: '—',
    lastUploadTime: '—'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminOverview component mounted');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // In a real implementation, you would fetch this data from your API
      // For now, use placeholder data with a delay to simulate loading
      setTimeout(() => {
        setStats({
          totalDocuments: '64',
          totalUsers: '152',
          recentUploads: '12',
          lastUploadTime: 'Today, 2:30 PM'
        });
        setLoading(false);
      }, 1500);

      // Example of how you might fetch real data
      // const response = await fetch(`${BACKEND_URL}/api/admin/stats`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setStats(data);
      // }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      // setLoading(false);
    }
  };

  console.log('AdminOverview rendering');
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FilePdf className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <h3 className="text-2xl font-bold">
                  {loading ? 
                    <span className="inline-block w-10 h-8 bg-gray-200 animate-pulse rounded"></span> : 
                    stats.totalDocuments
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">
                  {loading ? 
                    <span className="inline-block w-10 h-8 bg-gray-200 animate-pulse rounded"></span> : 
                    stats.totalUsers
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Uploads</p>
                <h3 className="text-2xl font-bold">
                  {loading ? 
                    <span className="inline-block w-10 h-8 bg-gray-200 animate-pulse rounded"></span> : 
                    stats.recentUploads
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Upload</p>
                <h3 className="text-sm font-bold">
                  {loading ? 
                    <span className="inline-block w-24 h-5 bg-gray-200 animate-pulse rounded"></span> : 
                    stats.lastUploadTime
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b pb-2">
                  <div className="w-3/4 h-5 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="w-1/3 h-4 bg-gray-100 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              <li className="border-b pb-2">
                <div className="font-medium">PDF 'Mathematics_I.pdf' uploaded</div>
                <div className="text-sm text-gray-500">Today at 2:30 PM</div>
              </li>
              <li className="border-b pb-2">
                <div className="font-medium">New user registered</div>
                <div className="text-sm text-gray-500">Yesterday at 5:45 PM</div>
              </li>
              <li className="border-b pb-2">
                <div className="font-medium">PDF 'Computer_Networks.pdf' uploaded</div>
                <div className="text-sm text-gray-500">Yesterday at 3:20 PM</div>
              </li>
              <li className="border-b pb-2">
                <div className="font-medium">Quiz created: "Data Structures"</div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview; 