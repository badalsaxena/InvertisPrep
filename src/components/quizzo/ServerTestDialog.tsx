import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Server, X, Coins, Info } from "lucide-react";
import { testSocketConnection, testApiEndpoints, testRewardEndpoint } from '@/api/test-integration';
import { useAuth } from '@/contexts/AuthContext';
import { addQuizReward } from '@/services/walletService';

export default function ServerTestDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    socket: boolean | null;
    healthApi: boolean | null;
    questionsApi: boolean | null;
    rewardApi: boolean | null;
  }>({
    socket: null,
    healthApi: null,
    questionsApi: null,
    rewardApi: null
  });
  const [directRewardTesting, setDirectRewardTesting] = useState(false);
  const [directRewardResult, setDirectRewardResult] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const runTests = async () => {
    setTesting(true);
    setResults({
      socket: null,
      healthApi: null,
      questionsApi: null,
      rewardApi: null
    });
    setDebugInfo(null);
    
    try {
      // Test socket connection
      const socketResult = await testSocketConnection()
        .catch(() => false);
      setResults(prev => ({ ...prev, socket: socketResult }));
      
      // Test API endpoints
      const apiResults = await testApiEndpoints();
      setResults(prev => ({ 
        ...prev, 
        healthApi: apiResults.health,
        questionsApi: apiResults.questions
      }));
      
      // Test reward endpoint
      try {
        const rewardResult = await testRewardEndpoint();
        setResults(prev => ({ ...prev, rewardApi: rewardResult }));
      } catch (error) {
        setResults(prev => ({ ...prev, rewardApi: false }));
        setDebugInfo(`Reward API Error: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Reward endpoint test error:', error);
      }
    } catch (error) {
      console.error('Error running tests:', error);
      setDebugInfo(`Test Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setTesting(false);
    }
  };
  
  // Test direct reward addition to Firebase
  const testDirectReward = async () => {
    if (!user) {
      setDirectRewardResult('No user logged in. Please log in first.');
      return;
    }
    
    setDirectRewardTesting(true);
    setDirectRewardResult(null);
    
    try {
      // Add 1 coin directly using the walletService
      const result = await addQuizReward(user.uid, 1, false, 'single', 'test');
      
      if (result) {
        setDirectRewardResult('Successfully added 1 QCoin directly to your wallet. Check your balance!');
      } else {
        setDirectRewardResult('Failed to add QCoin directly to your wallet.');
      }
    } catch (error) {
      console.error('Error testing direct reward:', error);
      setDirectRewardResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDirectRewardTesting(false);
    }
  };
  
  const renderStatus = (status: boolean | null) => {
    if (status === null) return <span className="text-gray-400">Not tested</span>;
    if (status) return <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Connected</span>;
    return <span className="text-red-600 flex items-center"><X className="h-4 w-4 mr-1" /> Failed</span>;
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Server className="h-4 w-4" />
          Test Backend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Backend Server Connection Test</DialogTitle>
          <DialogDescription>
            Test connection to your local backend server running on port 8080
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-3">Test Results</h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Socket.IO Connection:</span>
                {renderStatus(results.socket)}
              </li>
              <li className="flex justify-between items-center">
                <span>Health API:</span>
                {renderStatus(results.healthApi)}
              </li>
              <li className="flex justify-between items-center">
                <span>Questions API:</span>
                {renderStatus(results.questionsApi)}
              </li>
              <li className="flex justify-between items-center">
                <span>Reward API:</span>
                {renderStatus(results.rewardApi)}
              </li>
            </ul>
          </div>
          
          {debugInfo && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md flex items-start">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Debug Information</p>
                <p className="text-sm font-mono whitespace-normal break-all overflow-auto max-h-32">{debugInfo}</p>
              </div>
            </div>
          )}
          
          {(results.socket === false || results.healthApi === false || results.questionsApi === false || results.rewardApi === false) && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Connection Failed</p>
                <p className="text-sm">Make sure your backend server is running on http://localhost:8080 and has proper CORS headers.</p>
                <p className="text-sm mt-1">If using the frontend API, make sure you've added the route handler in main.tsx.</p>
              </div>
            </div>
          )}
          
          {(results.socket === true && results.healthApi === true && results.questionsApi === true && results.rewardApi === true) && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">All Tests Passed</p>
                <p className="text-sm">Your frontend is successfully connected to the local backend server.</p>
              </div>
            </div>
          )}
          
          {/* Direct Reward Testing Section */}
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium mb-3 flex items-center">
              <Coins className="h-4 w-4 mr-2" />
              Direct Reward Test
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Test direct QCoin reward system by adding 1 QCoin directly to your wallet.
              This bypasses the backend API and calls Firebase directly.
            </p>
            
            {directRewardResult && (
              <div className={`p-2 rounded-md mb-3 text-sm ${
                directRewardResult.includes('Successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {directRewardResult}
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={testDirectReward}
              disabled={directRewardTesting || !user}
              className="w-full"
            >
              {directRewardTesting ? (
                <>
                  <span className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Testing Direct Reward...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Test Direct QCoin Reward
                </>
              )}
            </Button>
          </div>
          
          <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
            <p className="text-xs">
              <strong>API Endpoints Tested:</strong>
            </p>
            <p className="text-xs font-mono">Socket.IO: ws://localhost:8080</p>
            <p className="text-xs font-mono">Health: http://localhost:8080/health</p>
            <p className="text-xs font-mono">Questions: http://localhost:8080/questions/c</p>
            <p className="text-xs font-mono">Reward: http://localhost:8080/api/quiz-rewards</p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {user ? `Logged in as: ${user.email}` : 'Not logged in'}
          </div>
          <Button
            onClick={runTests}
            disabled={testing}
            className="gap-1"
          >
            {testing ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : 'Run API Tests'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 