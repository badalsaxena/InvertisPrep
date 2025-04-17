import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [port, setPort] = useState('');
  const [corsOrigin, setCorsOrigin] = useState('');
  const [selectedDbOption, setSelectedDbOption] = useState('firebase');
  const [apiRoute, setApiRoute] = useState('/api/health');
  const [routeTestResults, setRouteTestResults] = useState<{route: string, status: number, time: number, response?: any}[]>([]);
  const [testingRoute, setTestingRoute] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  } | null>(null);

  // Common API routes to test
  const commonRoutes = [
    '/api/health',
    '/api/users',
    '/api/users/:uid',
    '/api/users/:uid/wallet',
    '/api/wallets/:uid'
  ];

  useEffect(() => {
    // Load saved settings from localStorage if they exist
    const savedPort = localStorage.getItem('backend_port');
    const savedCorsOrigin = localStorage.getItem('cors_origin');
    const savedDbOption = localStorage.getItem('db_option');
    
    if (savedPort) {
      setPort(savedPort);
    }
    
    if (savedCorsOrigin) {
      setCorsOrigin(savedCorsOrigin);
    } else {
      // Default to current origin
      setCorsOrigin(window.location.origin);
    }
    
    if (savedDbOption) {
      setSelectedDbOption(savedDbOption);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage({ message, type, visible: true });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleSavePort = () => {
    try {
      if (port) {
        localStorage.setItem('backend_port', port);
        showToast(`Backend port set to ${port}. You may need to refresh the app.`, 'success');
      } else {
        // If port is empty, remove the setting
        localStorage.removeItem('backend_port');
        showToast('Using default backend URL now.', 'info');
      }
    } catch (error) {
      showToast('Could not save your settings.', 'error');
    }
  };

  const handleSaveCorsSettings = () => {
    try {
      if (corsOrigin) {
        localStorage.setItem('cors_origin', corsOrigin);
        showToast('CORS origin settings saved. You may need to update your backend configuration.', 'success');
      } else {
        localStorage.removeItem('cors_origin');
        showToast('CORS origin setting cleared.', 'info');
      }
    } catch (error) {
      showToast('Could not save CORS settings.', 'error');
    }
  };

  const handleSaveDbOption = () => {
    try {
      localStorage.setItem('db_option', selectedDbOption);
      showToast(`Database option set to ${selectedDbOption}.`, 'success');
    } catch (error) {
      showToast('Could not save database settings.', 'error');
    }
  };

  const handleTestApiRoute = async () => {
    if (!apiRoute) return;
    
    setTestingRoute(true);
    
    try {
      // Replace :uid placeholder with mock user ID
      const testRoute = apiRoute.replace(':uid', '12fgiLaJ1RPiVpVJ2iZjSJTwOKF3');
      
      const baseUrl = port ? `http://localhost:${port}` : 'http://localhost:3000';
      const startTime = performance.now();
      
      // Try an OPTIONS request first to check CORS
      try {
        const optionsResponse = await fetch(`${baseUrl}${testRoute}`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'GET'
          }
        });
        
        // Record the OPTIONS result
        setRouteTestResults(prev => [
          {
            route: `OPTIONS ${testRoute}`,
            status: optionsResponse.status,
            time: Math.round(performance.now() - startTime)
          },
          ...prev.slice(0, 9) // Keep only 10 most recent results
        ]);
      } catch (error) {
        console.error('OPTIONS request failed:', error);
      }
      
      // Then try a GET request
      const getStartTime = performance.now();
      const response = await fetch(`${baseUrl}${testRoute}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Math.round(performance.now() - getStartTime);
      
      let responseData = null;
      try {
        if (response.headers.get('content-type')?.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (error) {
        responseData = 'Could not parse response';
      }
      
      // Add result to the list
      setRouteTestResults(prev => [
        {
          route: `GET ${testRoute}`,
          status: response.status,
          time: responseTime,
          response: responseData
        },
        ...prev.slice(0, 9) // Keep only 10 most recent results
      ]);
      
      if (response.status >= 200 && response.status < 300) {
        showToast(`Route ${testRoute} is available! Status: ${response.status}`, 'success');
      } else {
        showToast(`Route ${testRoute} returned status: ${response.status}`, response.status === 404 ? 'error' : 'info');
      }
    } catch (error) {
      console.error('Error testing route:', error);
      setRouteTestResults(prev => [
        {
          route: `GET ${apiRoute}`,
          status: 0,
          time: 0,
          response: `Error: ${error instanceof Error ? error.message : String(error)}`
        },
        ...prev.slice(0, 9)
      ]);
      
      showToast(`Failed to test route: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setTestingRoute(false);
    }
  };

  const handleBatchTestRoutes = async () => {
    setTestingRoute(true);
    
    const baseUrl = port ? `http://localhost:${port}` : 'http://localhost:3000';
    const results: {route: string, status: number, time: number, response?: any}[] = [];
    
    try {
      // Test each common route
      for (const route of commonRoutes) {
        try {
          const testRoute = route.replace(':uid', '12fgiLaJ1RPiVpVJ2iZjSJTwOKF3');
          const startTime = performance.now();
          
          const response = await fetch(`${baseUrl}${testRoute}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            // Set a short timeout to avoid waiting too long
            signal: AbortSignal.timeout(3000)
          });
          
          const responseTime = Math.round(performance.now() - startTime);
          
          results.push({
            route: `GET ${testRoute}`,
            status: response.status,
            time: responseTime
          });
        } catch (error) {
          results.push({
            route: `GET ${route}`,
            status: 0,
            time: 0,
            response: `Error: ${error instanceof Error ? error.message : String(error)}`
          });
        }
      }
      
      // Update results
      setRouteTestResults(results);
      
      // Check if we found any working endpoints
      const workingRoutes = results.filter(r => r.status >= 200 && r.status < 300);
      if (workingRoutes.length > 0) {
        showToast(`Found ${workingRoutes.length} working endpoints!`, 'success');
      } else {
        showToast('No working API endpoints found. Check your backend setup.', 'error');
      }
    } catch (error) {
      console.error('Error batch testing routes:', error);
      showToast(`Error testing routes: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setTestingRoute(false);
    }
  };

  const generateCorsInstructions = () => {
    if (!corsOrigin) return '';
    
    return `
# Node.js/Express configuration example:
const cors = require('cors');
app.use(cors({
  origin: '${corsOrigin}',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));`;
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'bg-gray-200 text-gray-800'; // Connection error
    if (status >= 200 && status < 300) return 'bg-green-200 text-green-800';
    if (status >= 400 && status < 500) return 'bg-amber-200 text-amber-800';
    return 'bg-red-200 text-red-800';
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Application Settings</h1>
      
      <div className="space-y-8 max-w-3xl">
        {/* Backend Connection Section */}
        <div className="w-full p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Backend Connection</h2>
          
          <div className="mb-4">
            <label htmlFor="port" className="block text-sm font-medium mb-1">
              Backend Port (localhost)
            </label>
            <Input 
              id="port"
              type="text" 
              value={port} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value)} 
              placeholder="e.g. 8080"
              className="w-48"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to use the default backend URL
            </p>
          </div>
          
          <Button 
            onClick={handleSavePort}
            className="mt-2"
          >
            Save Port Setting
          </Button>
        </div>

        {/* API Route Testing Section */}
        <div className="w-full p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">API Route Testing</h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
            <h3 className="font-semibold text-amber-800">404 Errors in Console?</h3>
            <p className="text-sm text-amber-700">
              Use this tool to test API routes and diagnose which endpoints are available on your backend.
              This helps identify mismatched routes between frontend and backend.
            </p>
          </div>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <label htmlFor="apiRoute" className="block text-sm font-medium mb-1">
                API Route to Test
              </label>
              <Input 
                id="apiRoute"
                type="text" 
                value={apiRoute} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiRoute(e.target.value)} 
                placeholder="/api/health"
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleTestApiRoute}
              disabled={testingRoute}
              className="mb-0"
            >
              {testingRoute ? 'Testing...' : 'Test Route'}
            </Button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Common Routes</label>
            <div className="flex flex-wrap gap-2">
              {commonRoutes.map(route => (
                <div 
                  key={route} 
                  className="px-2 py-1 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => setApiRoute(route)}
                >
                  {route}
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleBatchTestRoutes}
            disabled={testingRoute}
            className="mb-4"
          >
            {testingRoute ? 'Testing Routes...' : 'Test All Common Routes'}
          </Button>
          
          <div>
            <h3 className="font-medium mb-2">Test Results</h3>
            {routeTestResults.length === 0 ? (
              <p className="text-sm text-gray-500">No routes tested yet</p>
            ) : (
              <div className="border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (ms)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routeTestResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{result.route}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                            {result.status || 'Error'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{result.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {routeTestResults.length > 0 && routeTestResults[0].response && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Last Response</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {typeof routeTestResults[0].response === 'object' 
                    ? JSON.stringify(routeTestResults[0].response, null, 2) 
                    : String(routeTestResults[0].response)
                  }
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* CORS Settings Section */}
        <div className="w-full p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">CORS Configuration</h2>
          
          <div className="mb-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <h3 className="font-semibold text-amber-800">CORS Issues?</h3>
              <p className="text-sm text-amber-700">
                If you're experiencing CORS errors, your backend needs to be configured to allow requests from this origin. 
                Configure your backend server to include proper CORS headers.
              </p>
            </div>

            <label htmlFor="corsOrigin" className="block text-sm font-medium mb-1">
              Frontend Origin
            </label>
            <Input 
              id="corsOrigin"
              type="text" 
              value={corsOrigin} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCorsOrigin(e.target.value)} 
              placeholder={window.location.origin}
              className="w-full mb-2"
            />
            <p className="text-sm text-gray-500 mb-4">
              This is the origin that should be allowed in your backend's CORS configuration
            </p>

            <Button 
              onClick={handleSaveCorsSettings}
              className="mb-4"
            >
              Save CORS Setting
            </Button>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Backend Configuration Example:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                {generateCorsInstructions()}
              </pre>
            </div>
          </div>
        </div>

        {/* Database Configuration Section */}
        <div className="w-full p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Database Configuration</h2>
          
          <div className="mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-semibold text-blue-800">QCoin Storage Options</h3>
              <p className="text-sm text-blue-700">
                QCoins and wallet data need secure storage to prevent unauthorized access or manipulation.
                Choose the best option for your implementation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="firebase"
                  name="dbOption"
                  value="firebase"
                  checked={selectedDbOption === 'firebase'}
                  onChange={() => setSelectedDbOption('firebase')}
                  className="mr-2"
                />
                <label htmlFor="firebase" className="cursor-pointer">
                  <span className="font-medium">Firebase Firestore (Recommended)</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Store wallet data in Firestore under user collection. Secure with Firebase Authentication and Firestore Rules.
                  </p>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="mongodb"
                  name="dbOption"
                  value="mongodb"
                  checked={selectedDbOption === 'mongodb'}
                  onChange={() => setSelectedDbOption('mongodb')}
                  className="mr-2"
                />
                <label htmlFor="mongodb" className="cursor-pointer">
                  <span className="font-medium">MongoDB</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Suitable for custom backend implementations. Transactions support helps maintain wallet integrity.
                  </p>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="sql"
                  name="dbOption"
                  value="sql"
                  checked={selectedDbOption === 'sql'}
                  onChange={() => setSelectedDbOption('sql')}
                  className="mr-2"
                />
                <label htmlFor="sql" className="cursor-pointer">
                  <span className="font-medium">SQL Database (MySQL/PostgreSQL)</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Better for high transaction volume and complex queries. Use transactions for data integrity.
                  </p>
                </label>
              </div>
            </div>

            <Button 
              onClick={handleSaveDbOption}
              className="mt-4"
            >
              Save Database Preference
            </Button>

            <div className="mt-6 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium mb-2">Implementation Guide - {selectedDbOption === 'firebase' ? 'Firebase' : selectedDbOption === 'mongodb' ? 'MongoDB' : 'SQL'}</h3>
              
              {selectedDbOption === 'firebase' && (
                <div className="text-sm space-y-2">
                  <p><strong>Database Structure:</strong></p>
                  <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-auto">
{`users/
  ├── {uid}/
        ├── wallet/
        │     ├── balance: number
        │     ├── pendingTransactions: array
        │     ├── dailyEarnings: number
        │     ├── transactions/
        │     │     └── {transactionId}/
        │     │           ├── amount: number
        │     │           ├── type: string (DEPOSIT, REWARD, SPENT)
        │     │           ├── description: string
        │     │           ├── timestamp: Date
        │     │           ├── status: string (PENDING, COMPLETED, FAILED)
        │     │           └── verificationHash: string`}
                  </pre>
                  
                  <p><strong>Security Recommendations:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Use Firestore Rules to restrict wallet access to owner only</li>
                    <li>Implement Cloud Functions for transaction processing</li>
                    <li>Use transactions to maintain data integrity</li>
                    <li>Implement audit logging for all wallet changes</li>
                  </ul>
                </div>
              )}
              
              {selectedDbOption === 'mongodb' && (
                <div className="text-sm space-y-2">
                  <p><strong>Collections:</strong></p>
                  <ul className="list-disc pl-5">
                    <li><strong>users</strong> - User profiles with embedded wallet data</li>
                    <li><strong>transactions</strong> - Detailed transaction history</li>
                    <li><strong>walletLogs</strong> - Audit log for wallet changes</li>
                  </ul>
                  
                  <p><strong>Implementation Tips:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Use MongoDB transactions for balance changes</li>
                    <li>Implement server-side validation for all wallet operations</li>
                    <li>Set up indexes for query optimization</li>
                    <li>Consider sharding for large-scale deployments</li>
                  </ul>
                </div>
              )}
              
              {selectedDbOption === 'sql' && (
                <div className="text-sm space-y-2">
                  <p><strong>Tables:</strong></p>
                  <ul className="list-disc pl-5">
                    <li><strong>users</strong> - User profiles</li>
                    <li><strong>wallets</strong> - Wallet information with balance</li>
                    <li><strong>transactions</strong> - Transaction history</li>
                    <li><strong>wallet_logs</strong> - Audit logs for changes</li>
                  </ul>
                  
                  <p><strong>Implementation Tips:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Use SQL transactions for all balance modifications</li>
                    <li>Implement foreign key constraints for data integrity</li>
                    <li>Consider using stored procedures for transaction logic</li>
                    <li>Set up proper indexes for performance</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="w-full p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">1. Ensure your backend is running</h3>
              <p className="text-sm text-gray-600">Check that your backend server is actually running on the port you specified.</p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Check CORS configuration</h3>
              <p className="text-sm text-gray-600">Make sure your backend is properly configured to allow requests from this frontend origin.</p>
            </div>
            
            <div>
              <h3 className="font-medium">3. Network connectivity</h3>
              <p className="text-sm text-gray-600">Ensure there are no firewall or network issues blocking connections.</p>
            </div>
            
            <div>
              <h3 className="font-medium">4. Check browser console</h3>
              <p className="text-sm text-gray-600">Look for specific error messages in your browser's developer console (F12).</p>
            </div>

            <div>
              <h3 className="font-medium">5. Missing API Routes</h3>
              <p className="text-sm text-gray-600">If you see 404 errors for API routes, ensure these endpoints are actually implemented on your backend.</p>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && toastMessage.visible && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
          toastMessage.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
          toastMessage.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
          'bg-blue-100 border-blue-500 text-blue-800'
        } border-l-4`}>
          {toastMessage.message}
        </div>
      )}
    </div>
  );
};

export default Settings; 